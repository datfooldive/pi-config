---
name: cx
description: Semantic code navigation with the cx CLI. Use when exploring an unfamiliar codebase, locating symbols, tracing references, understanding a file before editing it, or when asked to inspect code structure without reading full files. Prefer this skill over reading whole source files when cx is available.
---

# Use cx for semantic code navigation

When `cx` is available in the project, prefer it over reading files directly.

## Escalation order

Start with the narrowest command that answers the question:

1. `cx overview <file>`
   - Use to understand a file's structure and top-level symbols.
   - Prefer this before reading a full file.

2. `cx symbols [--kind KIND] [--name GLOB] [--file PATH]`
   - Use to find symbols across the project.
   - Good for locating functions, types, classes, interfaces, and modules by name or kind.

3. `cx definition --name <name> [--from PATH] [--kind KIND]`
   - Use to read the exact body of a symbol.
   - Prefer this before editing a specific function or type.

4. `cx references --name <name> [--file PATH]`
   - Use to find all usages of a symbol before refactoring or changing public behavior.

5. Fall back to reading files only when needed.
   - Read the whole file only when you need broad surrounding context that `cx` does not provide.

## Default workflow

Use this sequence unless a more direct query is obviously better:

```bash
cx overview path/to/file
cx symbols --name '*Thing*'
cx definition --name Thing
cx references --name Thing
```

## When to use cx instead of reading files

Use `cx` first when you need to:

- understand a file's structure
- find where a function, type, or class is defined
- inspect a specific symbol body
- trace where a symbol is used
- explore a large codebase without loading full files into context
- recover context after compression by re-reading only the relevant symbol

## Command reference

```bash
cx overview PATH
cx symbols [--kind KIND] [--name GLOB] [--file PATH]
cx definition --name NAME [--from PATH] [--kind KIND]
cx references --name NAME [--file PATH]
cx lang list
cx lang add LANG [LANG...]
```

Short aliases:

```bash
cx o PATH
cx s --name '*Thing*'
cx d --name Thing
cx r --name Thing
```

Common symbol kinds:

- `fn`
- `method`
- `struct`
- `enum`
- `trait`
- `type`
- `const`
- `class`
- `interface`
- `module`
- `event`

## Editing guidance

Before modifying code:

1. Use `cx overview` on the file.
2. Use `cx definition` to inspect the exact symbol you plan to change.
3. Use `cx references` if the symbol may have callers or downstream impact.
4. Only then read more file context if still necessary.

## Missing language grammars

If `cx` reports a missing grammar, install it:

```bash
cx lang list
cx lang add rust
```

Replace `rust` with the needed language.

## Heuristics

- Prefer `cx overview` before reading any file larger than a quick helper.
- Prefer `cx definition` over full-file reads when targeting a named symbol.
- Prefer `cx references` before refactors, renames, or behavior changes.
- If `cx` cannot answer the question, then read the minimum required file context.
