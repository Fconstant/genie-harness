# interactive-cli

## Purpose

Provides an interactive readline-based REPL for the cursed genie agent. Supports multiline prompts, step-level visibility into agent reasoning, session history persistence, and color-coded output — while keeping headless mode for scripting.

## ADDED Requirements

### Requirement: Interactive readline loop
The system SHALL provide an interactive REPL that reads user prompts line-by-line, accumulates lines until submission, and runs the agent on the accumulated input.

#### Scenario: Single-line prompt
- **WHEN** user types a prompt and presses Enter on an empty line
- **THEN** the accumulated text is submitted to the agent

#### Scenario: Multi-line prompt
- **WHEN** user types multiple lines and then presses Enter on an empty line
- **THEN** all accumulated lines (joined by newlines) are submitted to the agent

#### Scenario: Exit command
- **WHEN** user types `exit` or `quit` on its own line
- **THEN** the REPL prints a goodbye message and exits gracefully

#### Scenario: Ctrl+C handling
- **WHEN** user presses Ctrl+C
- **THEN** the REPL exits gracefully without a stack trace

### Requirement: Step-level display
The system SHALL display agent progress at each step via the Mastra `onStepFinish` callback, showing step index, tool calls, and final result summary.

#### Scenario: Step indicator shown per step
- **WHEN** agent completes a step (tool call or final answer)
- **THEN** REPL prints `[Step N/M]` with a brief description of what happened

#### Scenario: Tool call shown in step
- **WHEN** agent issues a tool call (read_file, write_file, list_dir, run_command)
- **THEN** the step display includes the tool name and arguments summary

#### Scenario: Final summary after agent completes
- **WHEN** agent finishes (all steps done)
- **THEN** REPL prints total step count, finish reason, and full agent text

### Requirement: Session history persistence
The system SHALL persist conversation history to `.genie/history.jsonl` in JSONL format (one JSON object per line), loaded on start for multi-turn context.

#### Scenario: History appended after each turn
- **WHEN** agent returns a response
- **THEN** user prompt and assistant response are appended as two JSONL lines to `.genie/history.jsonl`

#### Scenario: History loaded for multi-turn context
- **WHEN** user starts a new prompt in the same session
- **THEN** previous turns (user + assistant pairs) are passed as message array to agent.generate()

#### Scenario: History file created on first interaction
- **WHEN** first prompt is submitted and no `.genie/history.jsonl` exists
- **THEN** the file and `.genie/` directory are created

### Requirement: Color-coded output
The system SHALL use ANSI escape codes to colorize different parts of the output for readability.

#### Scenario: Step indicators in yellow
- **WHEN** `[Step N/M]` is printed
- **THEN** it appears in yellow (`\x1b[33m`)

#### Scenario: Agent text in green
- **WHEN** agent response text is displayed
- **THEN** it appears in green (`\x1b[32m`)

#### Scenario: Metadata in gray
- **WHEN** step count, finish reason, or session metadata is displayed
- **THEN** it appears in gray (`\x1b[90m`)

#### Scenario: Errors in red
- **WHEN** an error occurs
- **THEN** error message appears in red (`\x1b[31m`)

### Requirement: Engine extraction and backward compatibility
The system SHALL extract agent creation and generate logic into `src/engine.ts`, keeping `src/index.ts` as a thin headless wrapper with the same CLI contract.

#### Scenario: engine.ts exports createAgent
- **WHEN** `createAgent()` is called
- **THEN** it returns `{ agent: Agent, curse: string }` using same provider setup as current index.ts

#### Scenario: engine.ts exports generate
- **WHEN** `generate(agent, input, callbacks?)` is called
- **THEN** it calls `agent.generate()` with `onStepFinish` support and returns `FullOutput`

#### Scenario: engine.ts supports multi-turn
- **WHEN** `generate()` receives a `SessionMessage[]` array
- **THEN** it passes the array as messages to `agent.generate()` instead of a single prompt string

#### Scenario: Headless backward compat
- **WHEN** user runs `bun run src/index.ts "prompt"`
- **THEN** behavior is identical to current implementation (result text + step count + finish reason printed to stdout)

### Requirement: bin entry point
The system SHALL register `src/cli.ts` as a bin entry in `package.json`.

#### Scenario: CLI invoked via bin
- **WHEN** `bun run src/cli.ts` is executed
- **THEN** it starts the interactive REPL

#### Scenario: CLI script in package.json
- **WHEN** `bun run cli` is executed
- **THEN** package.json script maps to `bun run src/cli.ts`
