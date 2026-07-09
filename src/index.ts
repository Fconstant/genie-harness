#!/usr/bin/env bun
import { createAgent, generate } from "./engine";

const prompt = process.argv[2];
if (!prompt) {
  console.error("Usage: bun run index.ts <prompt>");
  process.exit(1);
}

const { agent, curse } = createAgent();

console.log(`🧞 Curse: ${curse.split("\n")[2]}`);
console.log("---");

try {
  const result = await generate(agent, prompt);
  console.log(result.text);
  console.log("\n---");
  console.log(
    `Steps: ${result.steps.length}, Finish: ${result.finishReason}`,
  );
} catch (err) {
  console.error("Agent error:", err);
  process.exit(1);
}
