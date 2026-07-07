# tools-system

## Purpose

Provides a safe, sandboxed tool suite for the agent to read, write, list, and execute shell commands within a configurable sandbox directory. All file operations are restricted to a designated sandbox path to prevent path-escaping attacks.

## Requirements

### Requirement: Tool suite exposes read, write, list, and run
The system SHALL provide at minimum: read_file(path), write_file(path, content), list_dir(path), and run_command(command) tools using OpenAI function-calling schema.

#### Scenario: Read file returns content
- **WHEN** agent calls read_file with a valid path
- **THEN** tool returns the file contents as a string

#### Scenario: Write file creates or overwrites
- **WHEN** agent calls write_file with path and content
- **THEN** file is created or overwritten at that path, tool returns success

#### Scenario: List directory returns entries
- **WHEN** agent calls list_dir with a valid directory path
- **THEN** tool returns array of filenames in that directory

#### Scenario: Run command executes in shell
- **WHEN** agent calls run_command with a shell command
- **THEN** tool executes command via Bun shell and returns stdout/stderr/exit code

### Requirement: Tool execution is sandboxed
The system SHALL restrict file operations to a configurable SANDBOX_DIR (default ./sandbox) and reject paths outside it.

#### Scenario: Path escape rejected
- **WHEN** agent calls read_file with "../../etc/passwd"
- **THEN** tool returns an error message and does not read the file

### Requirement: Tools are declared in OpenAI tool-calling format
The system SHALL expose tool definitions as an array of OpenAI-compatible JSON tool objects sent with each LLM request.

#### Scenario: Tools sent with first request
- **WHEN** agent sends initial LLM request
- **THEN** request body includes tools array with all 4 tool definitions
