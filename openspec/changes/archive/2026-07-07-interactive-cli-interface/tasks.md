## 1. Engine extraction

- [x] 1.1 Create `src/engine.ts` with `createAgent()` function (lifted from current `index.ts`)
- [x] 1.2 Add `generate()` function that wraps `agent.generate()` with `onStepFinish` callback support
- [x] 1.3 Add `SessionMessage` type and multi-turn overload (accepts string or `SessionMessage[]`)

## 2. Headless backward compat

- [x] 2.1 Refactor `src/index.ts` to import `createAgent` + `generate` from engine.ts
- [x] 2.2 Verify identical behavior: `bun run src/index.ts "prompt"` prints same output

## 3. Interactive CLI

- [x] 3.1 Create `src/cli.ts` with readline loop (readline module, line accumulation, empty-line submit)
- [x] 3.2 Implement exit commands (`exit`, `quit`) and Ctrl+C graceful handling
- [x] 3.3 Wire `createAgent()` and `generate()` with `onStepFinish` callback for step-level display
- [x] 3.4 Display step indicators with tool call summaries between steps
- [x] 3.5 Print final result text + step count + finish reason after agent completes
- [x] 3.6 Add ANSI color coding: yellow steps, green agent text, gray metadata, red errors

## 4. Session persistence

- [x] 4.1 Create `.genie/` directory (if missing) and `.genie/history.jsonl` on first interaction
- [x] 4.2 Append user prompt + assistant response as JSONL lines after each turn
- [x] 4.3 Load existing history on start and pass as message array to `agent.generate()` for multi-turn context
- [x] 4.4 Add `.genie/` to `.gitignore`

## 5. Package config

- [x] 5.1 Add `"bin": "./src/cli.ts"` to package.json
- [x] 5.2 Add `"cli": "bun run src/cli.ts"` to scripts in package.json
