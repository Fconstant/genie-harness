## MODIFIED Requirements

### Requirement: Configurable via environment variables
The system SHALL read API_KEY, MODEL (default openai/gpt-4o), MAX_ITERATIONS (default 10), and API_BASE_URL (default https://openrouter.ai/api/v1) from environment.

#### Scenario: Custom model configured
- **WHEN** MODEL env var is set to "openai/gpt-4o-mini"
- **THEN** agent sends requests with model: "openai/gpt-4o-mini"

#### Scenario: Custom API endpoint
- **WHEN** API_BASE_URL is set to a local endpoint
- **THEN** agent sends requests to that endpoint instead of OpenRouter
