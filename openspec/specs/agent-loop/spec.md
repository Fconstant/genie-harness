# agent-loop

## Purpose

Implements an autonomous think-act-observe agent loop using Mastra AI SDK. The agent sends system prompt + conversation to an LLM, parses tool call responses, executes tools, appends observations, and repeats until a final answer or max iterations.

## Requirements

### Requirement: Agent loop runs iterative think-act-observe cycles
The system SHALL run a recursive loop: send system prompt + conversation to LLM, parse tool call response, execute tool, append observation, repeat until a final answer or max iterations.

#### Scenario: Single tool call completes task
- **WHEN** user prompt requires reading a file
- **THEN** agent issues read_file tool call, tool executes, observation is fed back, and agent produces final answer

#### Scenario: Max iterations reached
- **WHEN** agent exceeds configured MAX_ITERATIONS
- **THEN** loop terminates with a timeout message to user

### Requirement: Loop preserves conversation history
The system SHALL accumulate all turns (user, assistant, tool results) in a messages array sent with each LLM request.

#### Scenario: Multi-step task preserves context
- **WHEN** agent issues 3 sequential tool calls
- **THEN** each call includes full prior history including previous tool results

### Requirement: Configurable via environment variables
The system SHALL read API_KEY, MODEL (default openai/gpt-4o), MAX_ITERATIONS (default 10), and API_BASE_URL (default https://openrouter.ai/api/v1) from environment. It SHALL fall back to OPENAI_API_KEY if API_KEY is not set.

#### Scenario: Custom model configured
- **WHEN** MODEL env var is set to "openai/gpt-4o-mini"
- **THEN** agent sends requests with model: "openai/gpt-4o-mini"

#### Scenario: Custom API endpoint
- **WHEN** API_BASE_URL is set to a local endpoint
- **THEN** agent sends requests to that endpoint instead of OpenRouter
