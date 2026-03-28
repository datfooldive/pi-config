/**
 * Custom Footer Extension — Enhanced Status Bar
 *
 * Replaces the default pi footer with a rich status bar showing:
 * - Model name with thinking-level indicator
 * - Input/output token counts and accumulated cost
 * - Context window usage percentage (color-coded: green/yellow/red)
 * - Elapsed session time
 * - Current working directory (abbreviated)
 * - Git branch name (if available)
 *
 * The footer auto-refreshes every 30 seconds and on git branch changes.
 */

import { homedir } from "node:os";
import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
  /** Timestamp of the current session start, used for elapsed time. */
  let sessionStart = Date.now();

  /** Format a millisecond duration as a digital clock string (e.g. `3:01`, `1:03:01`). */
  function formatElapsed(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      // H:MM:SS format
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    // M:SS or MM:SS format
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /** Format a number with k-suffix for values ≥1000. */
  function fmt(n: number): string {
    if (n < 1000) {
      return `${n}`;
    }
    return `${(n / 1000).toFixed(1)}k`;
  }

  pi.on("session_start", async (_event, ctx) => {
    sessionStart = Date.now();

    ctx.ui.setFooter((tui, theme, footerData) => {
      const unsub = footerData.onBranchChange(() => tui.requestRender());
      const timer = setInterval(() => tui.requestRender(), 30000);

      return {
        dispose() {
          unsub();
          clearInterval(timer);
        },
        // biome-ignore lint/suspicious/noEmptyBlockStatements: Required by footer interface
        invalidate() {},
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Footer rendering combines multiple live metrics in one pass.
        render(width: number): string[] {
          let input = 0;
          let output = 0;
          let cost = 0;
          for (const e of ctx.sessionManager.getBranch()) {
            if (e.type === "message" && e.message.role === "assistant") {
              const m = e.message as AssistantMessage;
              input += m.usage.input;
              output += m.usage.output;
              cost += m.usage.cost.total;
            }
          }

          const usage = ctx.getContextUsage();
          const _ctxWindow = usage?.contextWindow ?? 0;
          const pct = usage?.percent ?? 0;

          const pctColor =
            pct > 75 ? "error" : pct > 50 ? "warning" : "success";

          const tokenStats = [
            theme.fg("accent", `${fmt(input)}/${fmt(output)}`),
            theme.fg("warning", `$${cost.toFixed(2)}`),
            theme.fg(pctColor, `${pct.toFixed(0)}%`),
          ].join(" ");

          const elapsed = theme.fg(
            "dim",
            `[${formatElapsed(Date.now() - sessionStart)}]`,
          );

          const cwd = process.cwd();
          const home = homedir();
          let displayPath: string;
          if (cwd.startsWith(home)) {
            // Show path relative to home with ~/ prefix
            const relative = cwd.slice(home.length);
            const parts = relative.split("/").filter((p) => p);
            displayPath =
              parts.length > 2
                ? `~/${parts.slice(-2).join("/")}`
                : `~${relative}`;
          } else {
            // Not in home, show last 2 parts without prefix
            const parts = cwd.split("/").filter((p) => p);
            displayPath = parts.length > 2 ? parts.slice(-2).join("/") : cwd;
          }
          const cwdStr = theme.fg("muted", displayPath);

          const branch = footerData.getGitBranch();
          const branchStr = branch ? theme.fg("accent", `git:${branch}`) : "";

          const thinking = pi.getThinkingLevel();
          const thinkColor =
            thinking === "high"
              ? "warning"
              : thinking === "medium"
                ? "accent"
                : thinking === "low"
                  ? "dim"
                  : "muted";
          const modelId = ctx.model?.id || "no-model";
          const modelStr = `${theme.fg(thinkColor, "*")} ${theme.fg("accent", modelId)}`;

          const sep = theme.fg("dim", " | ");
          const leftParts = [modelStr, tokenStats, elapsed, cwdStr];
          if (branchStr) {
            leftParts.push(branchStr);
          }
          const left = leftParts.join(sep);

          return [truncateToWidth(left, width)];
        },
      };
    });
  });

  pi.on("session_switch", (event, _ctx) => {
    if (event.reason === "new") {
      sessionStart = Date.now();
    }
  });
}
