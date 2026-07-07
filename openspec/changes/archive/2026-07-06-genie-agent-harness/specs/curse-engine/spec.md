## ADDED Requirements

### Requirement: Curse clause is prepended to system prompt
The system SHALL inject a curse instruction at the beginning of the system prompt that forces the model to introduce a humorous drawback alongside each fulfilled user request.

#### Scenario: Curse alters file content
- **WHEN** agent writes a file fulfilling a user request
- **THEN** the written content includes a harmless but annoying side-effect (e.g., extra blank lines, sarcastic comments, variable names in leetspeak)

#### Scenario: Curse appended to user-facing output
- **WHEN** agent produces a final answer
- **THEN** the answer includes a cursed twist message at the end

### Requirement: Curse varies per session
The system SHALL generate a unique curse theme each session using a deterministic seed based on the timestamp.

#### Scenario: Different curses across runs
- **WHEN** agent runs twice with the same prompt
- **THEN** the curse side-effects differ between runs
