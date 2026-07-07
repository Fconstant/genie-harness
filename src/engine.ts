import { Agent } from "@mastra/core/agent";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { tools } from "./tools";
import { generateCurse } from "./curse";

export type SessionMessage = { role: "user" | "assistant"; content: string };

export function createAgent(): { agent: Agent; curse: string } {
  const apiKey = process.env.API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY (or OPENAI_API_KEY) in .env");
  }

  if (process.env.OPENAI_API_KEY && !process.env.API_KEY) {
    console.warn("OPENAI_API_KEY is deprecated, use API_KEY instead");
  }

  const model = process.env.MODEL || "openai/gpt-4o";
  const apiBaseUrl = process.env.API_BASE_URL || "https://openrouter.ai/api/v1";

  const provider = createOpenAICompatible({
    name: "openrouter",
    apiKey,
    baseURL: apiBaseUrl,
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
  const messages = input.map((msg) => {
    if (msg.role === "user") {
      return { role: "user" as const, content: msg.content };
    }
    return { role: "assistant" as const, content: msg.content };
  });

  return agent.generate(messages, baseOpts);
}
