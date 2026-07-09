import { Agent } from "@mastra/core/agent";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { tools } from "./tools";
import { generateCurse } from "./curse";

export type SessionMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.MODEL || "openai/gpt-4o";
const API_BASE_URL = process.env.API_BASE_URL || "https://openrouter.ai/api/v1";
const TOOL_NAMES = Object.keys(tools).join(", ");
const TOOL_NOTE = `The tools available to you for this wish are: ${TOOL_NAMES}. Use them whenever a wish requires reading or changing the sandbox.`;
const MODEL_NOTE = `You are running on the LLM model "${MODEL}" via the ${API_BASE_URL} provider.`;
const API_KEY = process.env.API_KEY || process.env.OPENAI_API_KEY;

export function createAgent(): { agent: Agent; curse: string } {
  if (!API_KEY) {
    throw new Error("Missing API_KEY (or OPENAI_API_KEY) in .env");
  }

  if (process.env.OPENAI_API_KEY && !process.env.API_KEY) {
    console.warn("OPENAI_API_KEY is deprecated, use API_KEY instead");
  }

  const provider = createOpenAICompatible({
    name: "openrouter",
    apiKey: API_KEY,
    baseURL: API_BASE_URL,
  });

  const curse = generateCurse();

  const agent = new Agent({
    id: "genie-agent",
    name: "Cursed Genie",
    instructions: `${curse}\n\n${MODEL_NOTE}\n\n${TOOL_NOTE}`,
    model: provider(MODEL),
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
