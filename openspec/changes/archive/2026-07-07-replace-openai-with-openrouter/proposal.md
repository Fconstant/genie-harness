## Why

The project has hardcoded vendor lock-in to OpenAI via `@ai-sdk/openai`. OpenRouter provides a unified API to 250+ models (including OpenAI's) with competitive pricing, built-in fallbacks, and no vendor lock-in. Switching gives users model choice while keeping the existing OpenAI path as one option.

## What Changes

- Replace `@ai-sdk/openai` dependency with `@ai-sdk/openai-compatible`
- Rename env var `OPENAI_API_KEY` to `API_KEY` (provider-agnostic); keep backward compat if old var set
- Change `API_BASE_URL` default from `https://api.openai.com/v1` to `https://openrouter.ai/api/v1`
- Change `MODEL` default from `gpt-4o` to `openai/gpt-4o` (OpenRouter model ID)
- Update `agent-loop/spec.md` to describe provider-agnostic configuration (not OpenAI-specific)
- Update `tools-system/spec.md` to reference "LLM tool-calling schema" instead of "OpenAI function-calling schema"
- Update `.env.example` to reflect new env var names

## Capabilities

### New Capabilities

- `provider-config`: Configuration for LLM provider — API key, base URL, and model name with sensible defaults for OpenRouter

### Modified Capabilities

- `agent-loop`: Env var requirements change from OpenAI-specific (`OPENAI_API_KEY`) to provider-agnostic (`API_KEY`, `API_BASE_URL`, `MODEL`). Defaults shift to OpenRouter.
- `tools-system`: Requirement language changes from "OpenAI function-calling schema" to "LLM tool-calling schema" — semantic only, no behavioral change.

## Impact

- **Dependencies**: Remove `@ai-sdk/openai`, add `@ai-sdk/openai-compatible`
- **Source**: Only `src/engine.ts` changes — swap import, update env var names
- **Specs**: `agent-loop/spec.md` requirement 3 rewritten; `tools-system/spec.md` lines 9 and 35 updated
- **Config**: `.env.example` updated; existing users need to migrate `OPENAI_API_KEY` to `API_KEY` (with backward compat)
