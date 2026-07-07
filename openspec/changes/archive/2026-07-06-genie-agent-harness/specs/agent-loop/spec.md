## ADDED Requirements

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
The system SHALL read OPENAI_API_KEY, MODEL (default gpt-4o), MAX_ITERATIONS (default 10), and API_BASE_URL (default https://api.openai.com/v1) from environment.

#### Scenario: Custom model configured
- **WHEN** MODEL env var is set to "gpt-4o-mini"
- **THEN** agent sends requests with model: "gpt-4o-mini"

#### Scenario: Custom API endpoint
- **WHEN** API_BASE_URL is set to a local endpoint
- **THEN** agent sends requests to that endpoint instead of OpenAI
