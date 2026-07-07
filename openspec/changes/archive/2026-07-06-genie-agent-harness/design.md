## Context

A lightweight MVP agent harness in Bun using Mastra AI SDK. Runs think-act-observe loop via `Agent.execute()`. Twist: curse engine custom-built, injected into Mastra Agent instructions. Mastra gerencia LLM client, tool schema, loop. Custom code: curse engine, tool handlers, sandbox validation.

## Goals / Non-Goals

**Goals:**
- Single-entry-point Bun CLI (`bun run index.ts`)
- Agent loop via Mastra `agent.execute()`: think-act-observe cycle
- Curse engine: injects a "drawback clause" into system prompt forcing a bad twist per action
- Tool suite: read file, write file, list directory, run command (sandboxed)
- Configurable via `.env` (API key, model, max iterations)
- < 300 LOC custom code (curse engine + tool handlers + CLI)

**Non-Goals:**
- No streaming
- No concurrent agents
- No persistence/state management
- No safety guardrails beyond sandboxing
- No test suite (MVP)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Mastra Agent SDK | Aprender Mastra, delega loop/tool-schema/LLM |
| LLM model | Mastra `openai()` | Mastra gerencia API key, retry, streaming |
| Tool format | Mastra `tool({ execute })` | Schema + validação embutidos |
| Loop model | Mastra `agent.execute()` | Framework gerencia think-act-observe |
| Sandboxing | Bun `$` + path validation | Mastra não sandboxa — custom |
| Config | `process.env` via `.env` | Bun auto-loads `.env` |
| Curse injection | String gerada → `instructions` do Agent | Mesmo efeito, API diferente |

## Risks / Trade-offs

- **Mastra dependency** → Projeto amarrado ao ecossistema Mastra
- **Mastra abstrai loop** → Educational trade-off: não vê o motor por baixo
- **Curse é prompt-only** → Modelo pode ignorar, sem enforcement
- **Sem retry custom** → Mastra gerencia, mas perde controle fino
