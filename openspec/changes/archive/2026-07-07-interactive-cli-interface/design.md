## Context

Current `src/index.ts` is monolithic: argv parsing, agent setup, and generate call in one file. No interactive mode, no session persistence, no step visibility. Mastra SDK supports `onStepFinish` callback for step-level events, and `agent.generate()` accepts a messages array for multi-turn — both unused.

## Goals / Non-Goals

**Goals:**
- Extract agent creation + generate into `src/engine.ts` with clean API
- Build interactive CLI (`src/cli.ts`) with multiline readline loop, step display, color output
- Session persistence in `.genie/history.jsonl` (JSONL, append-only)
- Multi-turn conversation via message array passed to agent
- Backward-compatible headless mode via `src/index.ts` thin wrapper
- Minimal code — no new npm dependencies beyond existing

**Non-Goals:**
- No TUI framework (blessed/ink) — plain readline + ANSI codes
- No streaming token-by-token — step-level only (`onStepFinish`)
- No file attachment or drag-drop input
- No interactive tool approval workflow
- No multiple session management (single active session, file appended)

## Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| Engine API | `createAgent()` + `generate()` with `onStepFinish` callback | Single monolithic class | Keeps headless mode trivial, allows both sync and interactive consumers |
| Readline impl | Node `readline` module | `Bun.stdin` raw mode, `enquirer`/`prompts` | Built-in, zero deps, handles multiline + Ctrl+C naturally |
| Submit trigger | Empty line on its own submits accumulated buffer | `---` delimiter, Ctrl+D | Simpler for UX (just press Enter twice), no special escape chars |
| History format | JSONL (`.genie/history.jsonl`) | JSON array, SQLite, YAML | Append-only = no read-modify-write, grep-able, no corruption on truncation |
| History dir | `.genie/` at project root | `~/.config/mini-harness/`, XDG paths | Simple, local to project, easy to find. Gitignored |
| Multi-turn context | User + assistant message pairs only (no tool internals) | Full message dump including tool calls | Simpler, less token usage, Mastra already manages tool-internal messages |
| Step display | Print tool calls summary + step index | Full streaming per token, raw JSON dump | Level 1 from proposal — text out + step count + finish reason, plus tool call visibility |
| Color | ANSI escape codes inline | `chalk`, `picocolors` | Zero deps, trivial, Bun target guarantees terminal support |
| Curse application | Same as headless — curse string in Agent `instructions` | Per-response curse, user-requested re-roll | Simpler, unchanged behavior |

## Risks / Trade-offs

- **JSONL append-only** → No editing past turns. If user wants to go back and change something, not supported. Mitigation: acceptable for MVP, can add later if needed.
- **History grows unbounded** → Each turn adds messages, token count increases. Mitigation: document in spec; future work could cap context window or implement summarization.
- **readline on Windows** → ANSI colors might not render in old cmd.exe. Mitigation: Bun targets modern terminals, accept limitation.
- **Empty-line submit conflicts with need for blank lines in prompt** → Prompt text rarely needs intentional blank lines. Mitigation: edge case, accept for now.
