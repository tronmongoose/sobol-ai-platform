import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const getOpenAIInstance = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not found. Please configure VITE_OPENAI_API_KEY in your environment.");
  }
  return new OpenAI({ apiKey });
};

interface AgentConfig {
  autoVote: boolean;
  riskLevel: number;
}

export async function configureAgent(config: AgentConfig): Promise<void> {
  try {
    const openai = getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI agent managing DAO governance and task automation.",
        },
        {
          role: "user",
          content: `Configure agent with: Auto-voting: ${config.autoVote}, Risk Level: ${config.riskLevel}%`,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Invalid response from AI");
    }

    return Promise.resolve();
  } catch (error) {
    throw new Error("Failed to configure AI agent: " + (error as Error).message);
  }
}

export async function getAgentStatus(): Promise<{
  active: boolean;
  lastAction: string;
  timestamp: string;
}> {
  try {
    // If OpenAI API key is not configured, return a mock status
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return {
        active: false,
        lastAction: "API key not configured",
        timestamp: new Date().toISOString(),
      };
    }

    const openai = getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI agent. Report your current status in JSON format.",
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Invalid response from AI");
    }

    return {
      active: true,
      lastAction: "Configured agent settings",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Agent status error:", error);
    return {
      active: false,
      lastAction: "Error: " + (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
}