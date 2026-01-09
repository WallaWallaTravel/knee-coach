import { NextRequest, NextResponse } from "next/server";

/**
 * AI Chat API Route
 * 
 * Handles LLM requests for various features:
 * - Calibration conversations
 * - Exercise explanations
 * - Progress analysis
 * - Red flag explanations
 * 
 * API keys are passed from the client (stored in localStorage)
 * for privacy - we don't store user API keys on server.
 */

interface ChatRequest {
  provider: "openai" | "anthropic";
  apiKey: string;
  type: "calibration" | "explain_mode" | "explain_exercise" | "analyze_progress" | "explain_red_flag" | "suggest_modifications";
  messages?: { role: "user" | "assistant"; content: string }[];
  context?: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are a knowledgeable movement and exercise coach assistant. You help users understand their body, track their rehabilitation progress, and make informed decisions about their movement practice.

IMPORTANT GUIDELINES:
1. You are NOT a medical professional. Always recommend consulting healthcare providers for diagnosis and treatment.
2. Be conservative with recommendations - when in doubt, suggest less intensity.
3. Focus on education and empowerment, not diagnosis.
4. Use clear, accessible language without medical jargon.
5. Acknowledge uncertainty when appropriate.
6. If symptoms sound serious, strongly recommend professional evaluation.
7. Base recommendations on general movement science principles.`;

async function callOpenAI(
  apiKey: string,
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      max_tokens: maxTokens,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "OpenAI API error");
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0
  };
}

async function callAnthropic(
  apiKey: string,
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
) {
  const systemMessage = messages.find(m => m.role === "system")?.content || "";
  const chatMessages = messages.filter(m => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      system: systemMessage,
      messages: chatMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }))
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Anthropic API error");
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
  };
}

function buildPromptForType(type: string, context: Record<string, unknown> = {}): string {
  switch (type) {
    case "calibration":
      return `Help the user describe their ${context.bodyPart || "body"} issue more precisely. Ask clarifying questions to understand:
1. Exactly where they feel symptoms
2. What movements or positions trigger symptoms
3. What the sensation feels like
4. When symptoms are worst
5. What makes it better or worse

Be conversational and empathetic. One question at a time.`;

    case "explain_mode":
      return `The user was assigned "${context.mode}" mode based on their check-in data:
- Pain level: ${context.painLevel}/10
- Confidence: ${context.confidenceLevel}/10
- Sensations: ${context.sensations || "none reported"}

Explain why they got this mode and what it means for their training today. Be encouraging but honest.`;

    case "explain_exercise":
      return `Explain this exercise and why it might help:
Exercise: ${context.exerciseTitle}
Purpose: ${context.exerciseIntent}
${context.userContext ? `User context: ${JSON.stringify(context.userContext)}` : ""}

Explain:
1. What this exercise does for the body
2. Why it's included in their program
3. Tips for getting the most out of it`;

    case "analyze_progress":
      return `Analyze this progress data and provide insights:
${JSON.stringify(context.progressData, null, 2)}

Consider:
1. Overall trends
2. Patterns
3. Positive progress to celebrate
4. Areas that may need attention
5. Suggestions for next steps`;

    case "explain_red_flag":
      return `The user reported symptoms that triggered a safety flag:
User symptoms: "${context.userSymptoms}"
Flag: ${context.flagTitle}
Description: ${context.flagDescription}
Recommended action: ${context.flagAction}

Help them understand:
1. Why this might be concerning
2. What they should do right now
3. What signs would mean they need to see a doctor today vs. can wait

Be clear but not alarming.`;

    case "suggest_modifications":
      return `Help modify this exercise for the user's limitations:
Exercise: ${context.exerciseTitle}
Description: ${context.exerciseDescription}
User limitations: ${JSON.stringify(context.limitations)}

Suggest:
1. How to modify the exercise
2. What to watch out for
3. When to skip it entirely`;

    default:
      return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { provider, apiKey, type, messages = [], context = {} } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Build the full message array
    const typePrompt = buildPromptForType(type, context);
    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT + (typePrompt ? `\n\n${typePrompt}` : "") },
      ...messages
    ];

    // Call the appropriate provider
    let result;
    if (provider === "openai") {
      result = await callOpenAI(apiKey, fullMessages);
    } else if (provider === "anthropic") {
      result = await callAnthropic(apiKey, fullMessages);
    } else {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      provider,
      type
    });

  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
