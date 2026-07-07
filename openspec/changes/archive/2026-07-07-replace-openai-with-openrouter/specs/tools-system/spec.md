## MODIFIED Requirements

### Requirement: Tool suite exposes read, write, list, and run
The system SHALL provide at minimum: read_file(path), write_file(path, content), list_dir(path), and run_command(command) tools using LLM tool-calling schema.

### Requirement: Tools are declared in LLM tool-calling format
The system SHALL expose tool definitions as an array of OpenAI-compatible JSON tool objects sent with each LLM request.
