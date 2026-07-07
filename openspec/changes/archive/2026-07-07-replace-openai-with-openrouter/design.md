## Context

Currently `src/engine.ts` imports `@ai-sdk/openai` and uses `createOpenAI()` with OpenAI-specific env vars (`OPENAI_API_KEY`). The `API_BASE_URL` env var already supports routing to any OpenAI-compatible endpoint, but the package and defaults are locked to OpenAI. The project uses Mastra Agent which is provider-agnostic — only the provider factory call needs to change.

## Goals / Non-Goals

**Goals:**
- Replace `@ai-sdk/openai` with `@ai-sdk/openai-compatible` (Vercel AI SDK's generic OpenAI-compatible provider)
- Rename `OPENAI_API_KEY` to `API_KEY` with backward compat fallback
- Change `API_BASE_URL` default to `https://openrouter.ai/api/v1`
- Change `MODEL` default to `openai/gpt-4o` (OpenRouter model name)
- Update specs to use provider-agnostic language

**Non-Goals:**
- Multi-provider switching at runtime (punt to future)
- UI for provider selection
- Changing how tools or agent loop work

## Decisions

1. **Use `@ai-sdk/openai-compatible` instead of `@ai-sdk/openai`** — OpenRouter is OpenAI-compatible, so this package works with zero behavioral change. No custom HTTP client needed. `createOpenAICompatible()` has the same API shape as `createOpenAI()`.

2. **Rename `OPENAI_API_KEY` to `API_KEY`** — Provider-agnostic name. Old var still checked as fallback so existing `.env` files keep working. Log a warning if old var is used.

3. **Default `API_BASE_URL` to `https://openrouter.ai/api/v1`** — Users on OpenAI can set `API_BASE_URL=https://api.openai.com/v1` explicitly. No breaking change for anyone already using `API_BASE_URL`.

4. **Default `MODEL` to `openai/gpt-4o`** — OpenRouter model IDs use `provider/model` format. This matches what OpenRouter expects while giving the same model users expect.

## Risks / Trade-offs

- **Backward compat**: Users only setting `OPENAI_API_KEY` (not `API_KEY`) keep working. Risk: low.
- **OpenRouter requires signup**: Users must create an OpenRouter account. Mitigation: document in `.env.example` and README.
- **OpenRouter rate limits differ from OpenAI**: Mitigation: user responsibility, not handled in code.
