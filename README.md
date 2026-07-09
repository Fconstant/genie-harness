# Cursed Genie

A wish-granting AI agent with a twist. Cursed Genie uses [Mastra](https://mastra.ai) to run an LLM agent that fulfills any request you give it — but every response is filtered through a randomly-chosen "curse": a persona (pirate, Shakespearean, Gordon Ramsay, conspiracy theorist…) that it must apply to all output, code comments, and file writes.

It ships in two modes:

- **Interactive REPL** (`cli.ts`) — multi-turn chat with persistent history, for chaining wishes.
- **One-shot** (`index.ts`) — grant a single wish from the command line.

The agent can read, write, list, and run commands inside an isolated **sandbox** directory, so its "twisted" file edits stay contained.

## Quick Start

Requirements: [Bun](https://bun.com) installed.

```bash
# 1. Install dependencies
bun install

# 2. Create your environment file
cp .env.example .env
#    then edit .env and set API_KEY (see Configuration below)

# 3. Run a one-shot wish
bun run src/index.ts "write a hello world script in the sandbox"

# 4. Or open the interactive genie
bun run cli
```

You should see a randomly-selected curse printed, then the genie's (themed) response.

## Project Structure

```
quiet-planet/
├── src/
│   ├── index.ts        # One-shot entry: parse argv, run a single wish
│   ├── cli.ts          # Interactive REPL: multi-turn chat + history (`.genie/`)
│   ├── engine.ts       # Builds the Mastra Agent and drives `generate()`
│   ├── curse.ts        # Random persona picker ("the curse") + system prompt
│   └── tools.ts        # Sandbox tools: read_file, write_file, list_dir, run_command
├── .env.example        # Template for required env vars
├── package.json        # `cli` script -> bun run src/cli.ts
└── tsconfig.json       # Strict TS, bun types
```

## Configuration

Copy `.env.example` to `.env` and set:

| Variable        | Required | Default                       | Purpose                                              |
|-----------------|----------|-------------------------------|------------------------------------------------------|
| `API_KEY`       | yes*     | —                             | API key for the LLM provider. Alias `OPENAI_API_KEY` also works (deprecated). |
| `MODEL`         | no       | `openai/gpt-4o`               | Model id passed to the provider.                     |
| `API_BASE_URL`  | no       | `https://openrouter.ai/api/v1` | OpenAI-compatible endpoint (OpenRouter by default). |
| `MAX_ITERATIONS` | no     | `10`                          | Max agent steps per wish (tool-call loop cap).       |
| `SANDBOX_DIR`   | no       | `./sandbox`                   | Root directory the tools are allowed to touch.       |

\* `API_KEY` (or `OPENAI_API_KEY`) must be present or the agent refuses to start.

## Key Concepts

- **The Curse** — each session picks one persona from `CURSE_THEMES` in `src/curse.ts:1`. The persona is baked into the agent's system instructions and applied to everything the genie produces. It changes per run (seeded by `Date.now()`).
- **The Sandbox** — every tool path is resolved under `SANDBOX_DIR` and validated so it cannot escape (see `resolve()` in `src/tools.ts:9`). The genie literally cannot touch files outside it.
- **Agent loop** — `generate()` in `src/engine.ts:43` runs the model up to `maxSteps` times, letting it call tools repeatedly until the wish is "granted".

## Common Tasks

**Run a single wish**
```bash
bun run src/index.ts "explain what is in the sandbox"
```

**Start the interactive genie**
```bash
bun run cli
# > your wish here
# (empty line submits; 'exit' or 'quit' leaves)
```

**Pipe a wish in (scripting)**
```bash
echo "list the sandbox contents" | bun run cli
```

**Grant a wish that changes files**
```bash
bun run src/index.ts "create a fibonacci function in sandbox/fib.ts"
# The genie uses write_file — verify with:
ls sandbox
```

**Change the model / provider**
```bash
# .env
MODEL=anthropic/claude-3.5-sonnet
API_BASE_URL=https://openrouter.ai/api/v1
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Missing API_KEY (or OPENAI_API_KEY) in .env` | Set `API_KEY` (or `OPENAI_API_KEY`) in `.env`. |
| Agent never uses tools / just describes work | The curse prompt requires a tool call to grant a wish; check `MAX_ITERATIONS` is high enough and the model supports tool calling. |
| `Path escapes sandbox: ...` | You gave a path outside `SANDBOX_DIR`. Use paths relative to the sandbox root. |
| `Error: file not found` from a tool | The file isn't in the sandbox yet — `list_dir` with `.` to inspect. |
| `OPENAI_API_KEY is deprecated` warning | Rename the var to `API_KEY` in `.env`. |

## Notes

- Session history for the REPL is stored in `.genie/history.jsonl` (gitignored).
- The sandbox (`sandbox/`) is gitignored, so the genie's outputs won't be committed.
