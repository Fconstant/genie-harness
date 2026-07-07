## Why

The current mini-harness is a single-shot CLI: run once with a prompt, get one answer, exit. No session persistence, no interactive loop, no visibility into agent reasoning steps. To evolve from a toy demo into a usable developer tool, it needs an interactive mode with conversation history, step-level transparency, and a pleasant UX — while keeping the headless mode for scripting.

## What Changes

- **Engine extraction**: Lift agent setup + generate logic from `src/index.ts` into reusable `src/engine.ts` module
- **Interactive CLI** (`src/cli.ts`): New readline-based consumer with multiline input, step-level display, color output, and session history
- **Headless backward compat**: `src/index.ts` refactored to a thin wrapper around engine.ts, same CLI contract
- **Session persistence**: `.genie/history.jsonl` for conversation history across turns
- **`package.json`**: Add `bin` entry pointing to `src/cli.ts`, add `cli` script

## Capabilities

### New Capabilities

- `interactive-cli`: Readline-based interactive REPL for the cursed genie agent with multiline prompt, step-level visibility, color-coded output, and session history in `.genie/history.jsonl`

### Modified Capabilities

<!-- No existing specs change — engine extraction is internal refactor, not a behavior change -->

## Impact

- **`src/engine.ts`** — new file, exports `createAgent()` and `generate()`
- **`src/cli.ts`** — new file, interactive consumer
- **`src/index.ts`** — refactored to thin wrapper (~10 lines)
- **`package.json`** — add `"bin"` and `"scripts.cli"`
- **`.gitignore`** — add `.genie/` directory
- **No new npm dependencies** — ANSI color codes only, `readline` is built-in
