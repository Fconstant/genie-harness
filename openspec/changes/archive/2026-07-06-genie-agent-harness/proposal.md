## Why

Modern AI agent harnesses focus entirely on perfect execution. This project introduces a lightweight MVP agent harness in Bun that acts like a cursed genie: it executes user instructions perfectly, but always appends a mischievous twist or drawback (the "genie's curse") to the resulting filesystem or code. This provides a fun, gamified tool-use showcase and serves as an educational demo of unexpected model alignment side-effects.

## What Changes

- **CLI Interface**: A simple Bun-based CLI harness that takes a user prompt.
- **Recursive Agent Loop**: An autonomous think-act-observe cycle utilizing LLMs to solve tasks.
- **Curse Engine**: An inline system-prompt wrapper that forces the model to invent and apply a hilariously cursed "twist" alongside the user's requested solution.
- **Tool Suite**: A minimal, safe sandbox of tools (e.g., read file, write/edit file, and a mock/safe bash runner) allowing the agent to edit files and prove its success.

## Capabilities

### New Capabilities

- `agent-loop`: Autonomous think-act-observe recursive loop using Bun.
- `curse-engine`: System prompt override/enrichment that guarantees a customized bad twist for every user request.
- `tools-system`: Safe minimal filesystem tool suite (read, write, list) for the agent to manipulate files.

### Modified Capabilities

None.

## Impact

This is a standalone new project. There is no impact on existing codebases. It is built natively on Bun.
