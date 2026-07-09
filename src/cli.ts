#!/usr/bin/env bun
import * as readline from "node:readline";
import { existsSync, mkdirSync, appendFileSync, readFileSync } from "node:fs";
import { createAgent, generate } from "./engine";
import type { SessionMessage } from "./engine";

// ── ANSI color codes ──────────────────────────────────────────────
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const GRAY = "\x1b[90m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

// ── History ───────────────────────────────────────────────────────
const HISTORY_DIR = ".genie";
const HISTORY_FILE = `${HISTORY_DIR}/history.jsonl`;

function ensureHistoryDir(): void {
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function loadHistory(): SessionMessage[] {
  if (!existsSync(HISTORY_FILE)) return [];
  const raw = readFileSync(HISTORY_FILE, "utf-8");
  return raw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as SessionMessage);
}

function appendHistory(entry: SessionMessage): void {
  ensureHistoryDir();
  appendFileSync(HISTORY_FILE, JSON.stringify(entry) + "\n");
}

// ── Step display ──────────────────────────────────────────────────
function formatToolSummary(toolCall: any): string {
  const name = toolCall.toolName || "unknown";
  const input = toolCall.input;
  if (!input || Object.keys(input).length === 0) return name;
  const args = Object.entries(input)
    .map(([k, v]) => `${k}=${JSON.stringify(String(v))}`)
    .join(", ");
  return `${name}(${args})`;
}

function createStepHandler(maxSteps: number): (step: any) => void {
  return (step) => {
    const n = step.stepNumber + 1;
    const totalSteps = maxSteps;

    if (step.toolCalls && step.toolCalls.length > 0) {
      const tools = step.toolCalls.map(formatToolSummary).join("; ");
      console.log(`${YELLOW}[Step ${n}/${totalSteps}]${RESET} ${GRAY}${tools}${RESET}`);
    } else {
      const preview =
        step.text?.slice(0, 60).replace(/\n/g, " ") || "(thinking)";
      console.log(
        `${YELLOW}[Step ${n}/${totalSteps}]${RESET} ${GRAY}${preview}...${RESET}`,
      );
    }
  };
}

// ── Main REPL ─────────────────────────────────────────────────────
async function main() {
  const { agent, curse } = createAgent();
  const maxSteps = parseInt(process.env.MAX_ITERATIONS || "10", 10);
  let history = loadHistory();

  console.log(`${GRAY}🧞 Cursed Genie — interactive mode${RESET}`);
  console.log(
    `${GRAY}Curse: ${curse.split("\n")[3]}${RESET}`,
  );
  console.log(
    `${GRAY}Type multiline prompt, empty line to submit. 'exit' or 'quit' to leave.${RESET}\n`,
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${GREEN}> ${RESET}`,
  });

  // Accumulate lines until empty-line submit
  let lines: string[] = [];
  rl.prompt();

  rl.on("line", async (line) => {
    const trimmed = line.trim();

    // Exit commands (only on their own line at start of prompt)
    if (
      lines.length === 0 &&
      (trimmed === "exit" || trimmed === "quit")
    ) {
      console.log(`${GRAY}Goodbye!${RESET}`);
      rl.close();
      return;
    }

    // Empty line submits accumulated buffer
    if (trimmed === "") {
      if (lines.length === 0) {
        rl.prompt();
        return;
      }
      const prompt = lines.join("\n");
      lines = [];

      // Append user message to history
      const userMsg: SessionMessage = { role: "user", content: prompt };
      history.push(userMsg);
      appendHistory(userMsg);

      try {
        const onStepFinish = createStepHandler(maxSteps);
        const result = await generate(agent, history, {
          maxSteps,
          onStepFinish,
        });

        // Display final result
        console.log(`\n${GREEN}${result.text}${RESET}\n`);
        console.log(
          `${GRAY}Steps: ${result.steps.length}, Finish: ${result.finishReason}${RESET}\n`,
        );

        // Append assistant message to history
        const assistantMsg: SessionMessage = {
          role: "assistant",
          content: result.text,
        };
        history.push(assistantMsg);
        appendHistory(assistantMsg);
      } catch (err) {
        console.error(`${RED}Agent error:${RESET}`, err);
      }

      rl.prompt();
      return;
    }

    // Accumulate line
    lines.push(line);
    rl.setPrompt(`${GRAY}… ${RESET}`);
    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });

  // Ctrl+C graceful exit
  process.on("SIGINT", () => {
    console.log(`\n${GRAY}Goodbye!${RESET}`);
    rl.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(`${RED}Fatal:${RESET}`, err);
  process.exit(1);
});
