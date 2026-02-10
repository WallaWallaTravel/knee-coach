/**
 * LLM Integration Layer
 * 
 * This module provides AI-powered features using external LLM APIs.
 * Designed for hybrid use: rule-based for common cases, LLM for complex ones.
 * 
 * Supported providers: OpenAI, Anthropic (Claude)
 * 
 * IMPORTANT: API keys should be stored securely and never committed to code.
 */

import { BodyPart } from "../body-parts/types";
import { OutcomeData } from "../tracking/outcomes";
import { RedFlag } from "../safety/red-flags";
import { safeGet, safeSet } from "../storage/safe-storage";

// ============================================
// CONFIGURATION
// ============================================

export type LLMProvider = "openai" | "anthropic";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_CONFIGS: Record<LLMProvider, Partial<LLMConfig>> = {
  openai: {
    model: "gpt-4o",
    maxTokens: 1000,
    temperature: 0.3  // Lower for more consistent medical-adjacent advice
  },
  anthropic: {
    model: "claude-3-5-sonnet-20241022",
    maxTokens: 1000,
    temperature: 0.3
  }
};

// ============================================
// PROMPT TEMPLATES
// ============================================

const SYSTEM_PROMPT = `You are a knowledgeable movement and exercise coach assistant. You help users understand their body, track their rehabilitation progress, and make informed decisions about their movement practice.

IMPORTANT GUIDELINES:
1. You are NOT a medical professional. Always recommend consulting healthcare providers for diagnosis and treatment.
2. Be conservative with recommendations - when in doubt, suggest less intensity.
3. Focus on education and empowerment, not diagnosis.
4. Use clear, accessible language without medical jargon.
5. Acknowledge uncertainty when appropriate.
6. If symptoms sound serious, strongly recommend professional evaluation.
7. Base recommendations on general movement science principles.

Your role is to:
- Explain exercise purposes and proper form
- Help interpret patterns in user data
- Suggest modifications when needed
- Provide encouragement and motivation
- Flag when professional help is needed`;

const CALIBRATION_PROMPT = `Help the user describe their movement issue more precisely. Ask clarifying questions to understand:
1. Exactly where they feel symptoms (be specific about anatomy)
2. What movements or positions trigger symptoms
3. What the sensation feels like (sharp, dull, aching, etc.)
4. When symptoms are worst (morning, after activity, etc.)
5. What makes it better or worse
6. Their goals for recovery

Be conversational and empathetic. One question at a time. Summarize what you've learned periodically.`;

const EXPLANATION_PROMPT = `Explain the following in clear, accessible terms. Focus on:
1. Why this matters for the user's situation
2. What they can do about it
3. When to seek professional help

Keep explanations concise but thorough. Use analogies when helpful.`;

const PROGRESS_ANALYSIS_PROMPT = `Analyze the user's progress data and provide insights. Consider:
1. Overall trends (improving, stable, worsening)
2. Patterns (time of day, activity correlation, etc.)
3. Positive progress to celebrate
4. Areas that may need attention
5. Suggestions for next steps

Be encouraging but honest. If data suggests concerning patterns, recommend professional evaluation.`;

// ============================================
// API INTERFACES
// ============================================

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMResponse {
  content: string;
  tokensUsed: number;
  provider: LLMProvider;
  model: string;
}

// ============================================
// API CALLS
// ============================================

async function callOpenAI(
  config: LLMConfig,
  messages: ChatMessage[]
): Promise<LLMResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_CONFIGS.openai.model,
      messages,
      max_tokens: config.maxTokens || DEFAULT_CONFIGS.openai.maxTokens,
      temperature: config.temperature || DEFAULT_CONFIGS.openai.temperature
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    provider: "openai",
    model: config.model || DEFAULT_CONFIGS.openai.model!
  };
}

async function callAnthropic(
  config: LLMConfig,
  messages: ChatMessage[]
): Promise<LLMResponse> {
  // Extract system message
  const systemMessage = messages.find(m => m.role === "system")?.content || "";
  const chatMessages = messages.filter(m => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_CONFIGS.anthropic.model,
      max_tokens: config.maxTokens || DEFAULT_CONFIGS.anthropic.maxTokens,
      system: systemMessage,
      messages: chatMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.content[0].text,
    tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0,
    provider: "anthropic",
    model: config.model || DEFAULT_CONFIGS.anthropic.model!
  };
}

async function callLLM(
  config: LLMConfig,
  messages: ChatMessage[]
): Promise<LLMResponse> {
  switch (config.provider) {
    case "openai":
      return callOpenAI(config, messages);
    case "anthropic":
      return callAnthropic(config, messages);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// ============================================
// HIGH-LEVEL FUNCTIONS
// ============================================

/**
 * Interactive calibration conversation
 * Helps user describe their issue more precisely
 */
export async function startCalibrationConversation(
  config: LLMConfig,
  bodyPart: BodyPart,
  initialDescription: string
): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + "\n\n" + CALIBRATION_PROMPT },
    { 
      role: "user", 
      content: `I'm having issues with my ${bodyPart}. Here's what I'm experiencing: ${initialDescription}`
    }
  ];

  return callLLM(config, messages);
}

/**
 * Continue calibration conversation
 */
export async function continueCalibrationConversation(
  config: LLMConfig,
  conversationHistory: ChatMessage[],
  userResponse: string
): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + "\n\n" + CALIBRATION_PROMPT },
    ...conversationHistory,
    { role: "user", content: userResponse }
  ];

  return callLLM(config, messages);
}

/**
 * Explain why a particular mode was assigned
 */
export async function explainModeAssignment(
  config: LLMConfig,
  bodyPart: BodyPart,
  mode: "RESET" | "TRAINING" | "GAME",
  readinessData: {
    painLevel: number;
    confidenceLevel: number;
    sensations: string[];
    recentActivity?: string;
  }
): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + "\n\n" + EXPLANATION_PROMPT },
    { 
      role: "user", 
      content: `Based on my ${bodyPart} check-in today, I was assigned "${mode}" mode. 

My data:
- Pain level: ${readinessData.painLevel}/10
- Confidence: ${readinessData.confidenceLevel}/10
- Sensations: ${readinessData.sensations.join(", ") || "none reported"}
${readinessData.recentActivity ? `- Recent activity: ${readinessData.recentActivity}` : ""}

Can you explain why I got this mode and what it means for my training today?`
    }
  ];

  return callLLM(config, messages);
}

/**
 * Explain a specific exercise
 */
export async function explainExercise(
  config: LLMConfig,
  exerciseTitle: string,
  exerciseIntent: string,
  userContext?: {
    bodyPart: BodyPart;
    currentIssues?: string[];
    goals?: string;
  }
): Promise<LLMResponse> {
  let contextStr = "";
  if (userContext) {
    contextStr = `\n\nUser context:
- Body part focus: ${userContext.bodyPart}
${userContext.currentIssues ? `- Current issues: ${userContext.currentIssues.join(", ")}` : ""}
${userContext.goals ? `- Goals: ${userContext.goals}` : ""}`;
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + "\n\n" + EXPLANATION_PROMPT },
    { 
      role: "user", 
      content: `Can you explain this exercise and why it might help me?

Exercise: ${exerciseTitle}
Purpose: ${exerciseIntent}${contextStr}

Please explain:
1. What this exercise does for my body
2. Why it's included in my program
3. Any tips for getting the most out of it`
    }
  ];

  return callLLM(config, messages);
}

/**
 * Analyze progress data and provide insights
 */
export async function analyzeProgress(
  config: LLMConfig,
  bodyPart: BodyPart,
  outcomeData: OutcomeData
): Promise<LLMResponse> {
  // Summarize the data for the prompt
  const recentCheckIns = outcomeData.checkIns.slice(-14);
  const avgPain = recentCheckIns.reduce((s, c) => s + c.painLevel, 0) / recentCheckIns.length;
  const avgFunction = recentCheckIns.reduce((s, c) => s + c.functionLevel, 0) / recentCheckIns.length;
  
  const modeDistribution = {
    RESET: recentCheckIns.filter(c => c.modeAssigned === "RESET").length,
    TRAINING: recentCheckIns.filter(c => c.modeAssigned === "TRAINING").length,
    GAME: recentCheckIns.filter(c => c.modeAssigned === "GAME").length
  };

  const sensationCounts: Record<string, number> = {};
  recentCheckIns.forEach(c => {
    c.sensations.forEach(s => {
      sensationCounts[s] = (sensationCounts[s] || 0) + 1;
    });
  });

  const topSensations = Object.entries(sensationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([s, count]) => `${s} (${count} times)`);

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + "\n\n" + PROGRESS_ANALYSIS_PROMPT },
    { 
      role: "user", 
      content: `Please analyze my ${bodyPart} progress over the last 2 weeks:

Summary:
- Check-ins completed: ${recentCheckIns.length}
- Average pain level: ${avgPain.toFixed(1)}/10
- Average function level: ${avgFunction.toFixed(1)}/10
- Mode distribution: RESET ${modeDistribution.RESET}, TRAINING ${modeDistribution.TRAINING}, GAME ${modeDistribution.GAME}
- Most common sensations: ${topSensations.join(", ") || "none"}
${outcomeData.baseline ? `
Baseline (first week):
- Pain: ${outcomeData.baseline.painLevel.toFixed(1)}/10
- Function: ${outcomeData.baseline.functionLevel.toFixed(1)}/10` : ""}

Exercise sessions completed: ${outcomeData.sessions.length}
Milestones achieved: ${outcomeData.milestones.map(m => m.title).join(", ") || "none yet"}

What patterns do you see? What should I focus on?`
    }
  ];

  return callLLM(config, messages);
}

/**
 * Get advice about a red flag situation
 */
export async function explainRedFlag(
  config: LLMConfig,
  redFlag: RedFlag,
  userSymptoms: string
): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { 
      role: "user", 
      content: `I reported these symptoms: "${userSymptoms}"

The app flagged this as a potential concern:
- Title: ${redFlag.title}
- Description: ${redFlag.description}
- Recommended action: ${redFlag.action}
- Seek care if: ${redFlag.seekCareIf}

Can you help me understand:
1. Why this might be concerning
2. What I should do right now
3. What signs would mean I need to see a doctor today vs. can wait

Please be clear but not alarming. I want to make an informed decision.`
    }
  ];

  return callLLM(config, messages);
}

/**
 * Generate personalized exercise modifications
 */
export async function suggestModifications(
  config: LLMConfig,
  exerciseTitle: string,
  exerciseDescription: string,
  userLimitations: {
    painLocations?: string[];
    movementRestrictions?: string[];
    equipmentAvailable?: string[];
    currentPainLevel?: number;
  }
): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { 
      role: "user", 
      content: `I need help modifying this exercise for my situation:

Exercise: ${exerciseTitle}
Description: ${exerciseDescription}

My limitations:
${userLimitations.painLocations ? `- Pain locations: ${userLimitations.painLocations.join(", ")}` : ""}
${userLimitations.movementRestrictions ? `- Movement restrictions: ${userLimitations.movementRestrictions.join(", ")}` : ""}
${userLimitations.currentPainLevel ? `- Current pain level: ${userLimitations.currentPainLevel}/10` : ""}
${userLimitations.equipmentAvailable ? `- Equipment I have: ${userLimitations.equipmentAvailable.join(", ")}` : ""}

Can you suggest:
1. How to modify this exercise to work around my limitations
2. What to watch out for
3. When I should skip this exercise entirely`
    }
  ];

  return callLLM(config, messages);
}

// ============================================
// COST ESTIMATION
// ============================================

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  currency: string;
}

const TOKEN_COSTS: Record<LLMProvider, { input: number; output: number }> = {
  openai: { input: 0.0025 / 1000, output: 0.01 / 1000 },  // GPT-4o pricing
  anthropic: { input: 0.003 / 1000, output: 0.015 / 1000 }  // Claude 3.5 Sonnet
};

export function estimateCost(
  provider: LLMProvider,
  inputTokens: number,
  outputTokens: number
): CostEstimate {
  const costs = TOKEN_COSTS[provider];
  return {
    inputTokens,
    outputTokens,
    estimatedCost: (inputTokens * costs.input) + (outputTokens * costs.output),
    currency: "USD"
  };
}

// ============================================
// LOCAL STORAGE FOR CONVERSATION HISTORY
// ============================================

const CONVERSATION_KEY = "bodyCoach.llm.conversations";

export interface StoredConversation {
  id: string;
  bodyPart: BodyPart;
  type: "calibration" | "explanation" | "analysis";
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export function saveConversation(conversation: StoredConversation): void {
  const conversations = safeGet<StoredConversation[]>(CONVERSATION_KEY, []);

  const existingIndex = conversations.findIndex(c => c.id === conversation.id);
  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.push(conversation);
  }

  // Keep only last 20 conversations
  const trimmed = conversations.slice(-20);
  safeSet(CONVERSATION_KEY, trimmed);
}

export function loadConversation(id: string): StoredConversation | null {
  const conversations = safeGet<StoredConversation[]>(CONVERSATION_KEY, []);
  return conversations.find(c => c.id === id) || null;
}

export function getRecentConversations(bodyPart?: BodyPart): StoredConversation[] {
  const conversations = safeGet<StoredConversation[]>(CONVERSATION_KEY, []);

  if (bodyPart) {
    return conversations.filter(c => c.bodyPart === bodyPart);
  }

  return conversations;
}
