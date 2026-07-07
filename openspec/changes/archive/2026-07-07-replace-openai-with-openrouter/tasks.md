## 1. Dependencies

- [x] 1.1 Remove `@ai-sdk/openai` from package.json
- [x] 1.2 Add `@ai-sdk/openai-compatible` to package.json
- [x] 1.3 Run `bun install` to update lockfile

## 2. Engine

- [x] 2.1 Replace `import { createOpenAI } from "@ai-sdk/openai"` with `import { createOpenAICompatible } from "@ai-sdk/openai-compatible"` in `src/engine.ts`
- [x] 2.2 Replace `OPENAI_API_KEY` env var usage with `API_KEY` (fall back to `OPENAI_API_KEY` if unset, with a warning)
- [x] 2.3 Change `API_BASE_URL` default from undefined to `https://openrouter.ai/api/v1`
- [x] 2.4 Change `MODEL` default from `gpt-4o` to `openai/gpt-4o`
- [x] 2.5 Replace `createOpenAI({...})` call with `createOpenAICompatible({...})` and update model reference

## 3. Config

- [x] 3.1 Update `.env.example`: `OPENAI_API_KEY` → `API_KEY`, `MODEL` default to `openai/gpt-4o`

## 4. Specs

- [x] 4.1 Update `openspec/specs/agent-loop/spec.md`: rewrite requirement 3 with provider-agnostic env vars and new defaults
- [x] 4.2 Update `openspec/specs/tools-system/spec.md`: change "OpenAI function-calling schema" to "LLM tool-calling schema" in requirements
- [x] 4.3 Create `openspec/specs/provider-config/spec.md` with the new provider configuration requirements

## 5. Verify

- [x] 5.1 Run `bun test` to confirm no regressions (no tests exist, skipped)
- [x] 5.2 Verify module chain loads and imports resolve correctly
