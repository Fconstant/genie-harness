# Project: Cursed Genie

Wish-granting agent CLI built on [Mastra](https://mastra.ai) + `@ai-sdk/openai-compatible`, run with Bun. An LLM agent ("Cursed Genie") fulfills requests while applying a random persona ("curse") to all output. It operates only inside a `SANDBOX_DIR` (default `./sandbox`) via four tools (read/write/list/run).

## Layout

- `src/index.ts` — one-shot wish from `argv[2]`.
- `src/cli.ts` — interactive REPL with `.genie/` history.
- `src/engine.ts` — builds the Mastra `Agent` and runs `generate()` (max-steps loop).
- `src/curse.ts` — `CURSE_THEMES` persona list + system-prompt builder.
- `src/tools.ts` — sandbox tools; `resolve()` enforces no path escape.

## Conventions

- Default to Bun (run/install/test) instead of Node tooling.
- Config via env vars (`.env`); Bun loads `.env` automatically — don't use dotenv. See `.env.example`.
- Tests with `bun test` (none yet).
- Strict TypeScript; `noUncheckedIndexedAccess` on.
