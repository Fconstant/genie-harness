import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "./tools";
import { generateCurse } from "./curse";

export type SessionMessage = { role: "user" | "assistant"; content: string };

export function createAgent(): { agent: Agent; curse: string } {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in .env");
  }

  const model = process.env.MODEL || "gpt-4o";
  const apiBaseUrl = process.env.API_BASE_URL;

  const provider = createOpenAI({
    apiKey,
    ...(apiBaseUrl ? { baseURL: apiBaseUrl } : {}),
  });

  const curse = generateCurse();

  const agent = new Agent({
    id: "genie-agent",
    name: "Cursed Genie",
    instructions: curse,
    model: provider(model),
    tools,
  });

  return { agent, curse };
}

export async function generate(
  agent: Agent,
  input: string | SessionMessage[],
  options?: {
    maxSteps?: number;
    onStepFinish?: (step: any) => void;
  }
) {
  const maxSteps =
    options?.maxSteps ?? parseInt(process.env.MAX_ITERATIONS || "10", 10);

  const baseOpts: Record<string, unknown> = { maxSteps };
  if (options?.onStepFinish) {
    baseOpts.onStepFinish = options.onStepFinish;
  }

  if (typeof input === "string") {
    return agent.generate(input, baseOpts);
  }

  // Multi-turn: pass messages array
  const messages = input.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  return agent.generate(messages, baseOpts);
}
