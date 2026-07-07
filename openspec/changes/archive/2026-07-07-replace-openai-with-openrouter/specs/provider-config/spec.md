## ADDED Requirements

### Requirement: LLM provider is configurable via environment variables
The system SHALL read API_KEY, API_BASE_URL (default https://openrouter.ai/api/v1), and MODEL (default openai/gpt-4o) from environment variables to configure the LLM provider.

#### Scenario: Default OpenRouter configuration
- **WHEN** user sets only API_KEY
- **THEN** agent sends requests to https://openrouter.ai/api/v1 with model openai/gpt-4o

#### Scenario: Custom API endpoint
- **WHEN** user sets API_BASE_URL to a local endpoint
- **THEN** agent sends requests to that endpoint instead of OpenRouter

#### Scenario: Custom model
- **WHEN** MODEL env var is set to "anthropic/claude-sonnet-4"
- **THEN** agent sends requests with model "anthropic/claude-sonnet-4"

### Requirement: Backward compatibility with OPENAI_API_KEY
The system SHALL fall back to OPENAI_API_KEY if API_KEY is not set, and SHALL warn the user to migrate.

#### Scenario: Old env var used
- **WHEN** OPENAI_API_KEY is set but API_KEY is not
- **THEN** agent uses OPENAI_API_KEY value
