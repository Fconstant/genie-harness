## 1. Project Setup

- [x] 1.1 Init Bun project: `bun init`, create `.env.example`
- [x] 1.2 Create `sandbox/` directory for safe file ops
- [x] 1.3 Install Mastra: `bun add mastra`

## 2. Tool System (Mastra tools)

- [x] 2.1 Define tools via Mastra `tool()`: read_file, write_file, list_dir, run_command
- [x] 2.2 Implement read_file handler with sandbox path validation
- [x] 2.3 Implement write_file handler with sandbox path validation
- [x] 2.4 Implement list_dir handler with sandbox path validation
- [x] 2.5 Implement run_command handler using Bun.$ with sandbox cwd
- [x] 2.6 Register all tools in tool array for Agent config

## 3. Curse Engine

- [x] 3.1 Implement curse prompt generator with timestamp-based seed
- [x] 3.2 Pass curse string as Agent `instructions` prop

## 4. CLI Entry Point

- [x] 4.1 Configure Mastra Agent with model, instructions (curse), tools
- [x] 4.2 Read user prompt from CLI arg, call `agent.execute(prompt)`
- [x] 4.3 Print final answer with curse twist to stdout
