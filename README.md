# Pi Config

My personal [pi](https://github.com/badlogic/pi) configuration — agents, skills, extensions, and prompts that shape how pi works for me.

## Setup

Clone this repo directly to `~/.pi/agent/` — pi auto-discovers everything from there (extensions, skills, agents, AGENTS.md, mcp.json). No symlinks, no manual wiring.

### Fresh machine

```bash
# 1. Install pi (https://github.com/badlogic/pi)

# 2. Clone this repo as your agent config
mkdir -p ~/.pi
git clone git@github.com:umgbhalla/pi-config ~/.pi/agent

# 3. Run setup (installs packages + extension deps)
cd ~/.pi/agent && ./setup.sh

# 4. Add your API keys to ~/.pi/agent/auth.json

# 5. Restart pi
```

### Updating

```bash
cd ~/.pi/agent && git pull
```

---

## Architecture

This config uses **Agent Teams** — a system that brings Claude Code-style team orchestration to Pi. You (the leader) can spawn teammates, share a task list, and coordinate work across multiple parallel Pi sessions.

### Key Concepts

- **Teammates** — child Pi processes that poll for tasks, execute them, and report back. Teammates can clone the leader's session context (`branch`) and work in isolated git workspaces (`worktree`).
- **Shared Task List** — file-based task tracking with dependency support. Idle teammates automatically pick up unassigned, unblocked tasks.
- **Mailboxes** — asynchronous file-based messaging for DMs and broadcasts between the leader and teammates.
- **Governance** — optional workflows like plan-required teammates (`/team spawn <name> plan`) or full-delegate mode (`/team delegate on`).

---

## Agents

Unlike legacy setups, this configuration doesn't rely on rigidly defined "Scout" or "Worker" roles. Instead, teammates are dynamically spawned clones of the leader (or fresh sessions) that pick up tasks from the shared backlog. The LLM acts autonomously to break down work and delegate.

*(Note: Custom default model policies or hooks can be configured via standard `pi-agent-teams` policies.)*

## Skills

Loaded on-demand when the context matches.

| Skill | When to Load |
|-------|-------------|
| **commit** | Making git commits (mandatory for every commit) |
| **code-simplifier** | Simplifying or cleaning up code |
| **github** | Working with GitHub via `gh` CLI |
| **iterate-pr** | Iterating on a PR until CI passes |
| **learn-codebase** | Onboarding to a new project, checking conventions |
| **session-reader** | Reading and analyzing pi session JSONL files |
| **skill-creator** | Scaffolding new agent skills |
| **presentation-creator** | Creating data-driven presentation slides |
| **add-mcp-server** | Adding MCP server configurations |

## Extensions

| Extension | What it provides |
|-----------|------------------|
| **answer/** | `/answer` command + `Ctrl+.` — extracts questions into interactive Q&A UI |
| **bg-sessions/** | Background session management — keep sessions running while switching |
| **cost/** | `/cost` command — API cost summary |
| **execute-command/** | `execute_command` tool — lets the agent self-invoke slash commands |
| **pi-mono/** | Dev tooling — diff viewer, file browser, prompt URL widget, redraws, TPS counter |
| **restart/** | `/restart` command — restart the current session |
| **todos/** | `/todos` command + `todo` tool — file-based todo management |
| **watchdog/** | Monitors agent behavior |

## Commands

| Command | Description |
|---------|-------------|
| `/swarm [task]` | Spawn a team and orchestrate work on a task |
| `/team spawn <name>` | Start a teammate (supports `branch`, `worktree`, `plan` modes) |
| `/tw` or `/team panel` | Open the interactive widget panel to monitor teammates |
| `/team task add <text>` | Create a task (prefix with `name:` to assign) |
| `/team dm <name> <msg>` | Send a mailbox message to a teammate |
| `/team shutdown` | Gracefully shut down all teammates |
| `/team done` | End a team run, stop teammates, and hide the widget |
| `/switch` | Switch sessions while optionally keeping current one running in background |
| `/bg [list\|kill\|attach\|logs\|clear]` | Manage background sessions |
| `/answer` | Extract questions into interactive Q&A |
| `/todos` | Visual todo manager |
| `/cost` | API cost summary |
| `/resume` | Switch to a previous session |

## Packages

Installed via `pi install`, managed in `settings.json`.

| Package | Description |
|---------|-------------|
| [pi-agent-teams](https://github.com/tmustier/pi-agent-teams) | Team orchestration, shared task list, mailboxes, and `/swarm`, `/team` commands |
| [pi-parallel](https://github.com/HazAT/pi-parallel) | Parallel web search, extract, research, and enrich tools |
| [pi-smart-sessions](https://github.com/HazAT/pi-smart-sessions) | AI-generated session names |
| [pi-autoresearch](https://github.com/HazAT/pi-autoresearch) | Autonomous experiment loop with dashboard |
| [pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) | MCP server integration |
| [glimpse](https://github.com/HazAT/glimpse) | Native macOS UI — dialogs, forms, visualizations |
| [chrome-cdp-skill](https://github.com/pasky/chrome-cdp-skill) | Chrome DevTools Protocol CLI for visual testing |

---

## Credits

Extensions from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff): `answer`, `todos`, `uv`

Skills from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff): `commit`, `github`

Skills from [getsentry/skills](https://github.com/getsentry/skills): `code-simplifier`
