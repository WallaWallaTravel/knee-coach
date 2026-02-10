"use client";

import { useState, useEffect, useRef } from "react";
import { BodyPart } from "@/lib/body-parts/types";
import { safeGet } from "@/lib/storage/safe-storage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  bodyPart: BodyPart;
  type: "calibration" | "explain_mode" | "explain_exercise" | "analyze_progress" | "explain_red_flag";
  context?: Record<string, unknown>;
  initialMessage?: string;
  onClose?: () => void;
  onComplete?: (messages: Message[]) => void;
}

interface AISettings {
  provider: "openai" | "anthropic" | "none";
  apiKey: string;
  enableAIFeatures: boolean;
}

export function AIChat({
  bodyPart,
  type,
  context = {},
  initialMessage,
  onClose,
  onComplete
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load AI settings
  useEffect(() => {
    const settings = safeGet<AISettings | null>("bodyCoach.settings.ai", null);
    if (settings) {
      setAiSettings(settings);
    }
  }, []);

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && aiSettings?.enableAIFeatures && messages.length === 0) {
      sendMessage(initialMessage);
    }
  }, [initialMessage, aiSettings]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!aiSettings?.enableAIFeatures || !aiSettings.apiKey) {
      setError("AI features are not configured. Go to Settings to set up.");
      return;
    }

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
          type,
          messages: newMessages,
          context: { ...context, bodyPart }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.content };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      if (onComplete) {
        onComplete(updatedMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input.trim());
    }
  };

  // Not configured state
  if (!aiSettings?.enableAIFeatures) {
    return (
      <div className="flex flex-col h-[400px] bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 bg-surface-raised border-b border-surface-border">
          <h3 className="m-0 text-base">AI Assistant</h3>
          {onClose && (
            <button
              className="w-7 h-7 border-none rounded-md bg-surface-border text-muted text-lg cursor-pointer hover:bg-surface-border-hover hover:text-gray-100"
              onClick={onClose}
              aria-label="Close"
            >×</button>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-5xl opacity-50 mb-3">🤖</span>
          <h4 className="m-0 mb-2 text-muted">AI Features Not Configured</h4>
          <p className="m-0 mb-4 text-sm text-muted">Set up your AI provider in Settings to enable smart features.</p>
          <a href="/settings" className="btn btn-primary">
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  const chatTitle = type === "calibration" ? "Smart Calibration" :
    type === "explain_mode" ? "Mode Explanation" :
    type === "explain_exercise" ? "Exercise Guide" :
    type === "analyze_progress" ? "Progress Analysis" :
    type === "explain_red_flag" ? "Safety Guidance" : "AI Assistant";

  return (
    <div className="flex flex-col h-[400px] bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-surface-raised border-b border-surface-border">
        <h3 className="m-0 text-base">{chatTitle}</h3>
        {onClose && (
          <button
            className="w-7 h-7 border-none rounded-md bg-surface-border text-muted text-lg cursor-pointer hover:bg-surface-border-hover hover:text-gray-100"
            onClick={onClose}
            aria-label="Close"
          >×</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted">
            <span className="text-3xl mb-2 opacity-50">💬</span>
            <p className="m-0 text-sm">
              {type === "calibration"
                ? "Describe your issue and I'll help you pinpoint exactly what's going on."
                : type === "explain_mode"
                ? "I'll explain why you got this mode and what it means for today."
                : type === "explain_exercise"
                ? "Ask me anything about this exercise."
                : type === "analyze_progress"
                ? "I'll analyze your progress data and share insights."
                : "How can I help you?"}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2.5 mb-4">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0 ${
              msg.role === "assistant" ? "bg-indigo-950" : "bg-surface-border"
            }`}>
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className={`flex-1 px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
              msg.role === "user" ? "bg-surface-border" : "bg-surface-raised"
            }`}>
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className="m-0 mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 mb-4">
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-950 rounded-lg text-base shrink-0">🤖</div>
            <div className="flex-1 flex gap-1 px-3.5 py-3.5 bg-surface-raised rounded-xl">
              <span className="ai-loading-dot"></span>
              <span className="ai-loading-dot"></span>
              <span className="ai-loading-dot"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/15 rounded-lg text-red-300 text-[13px]">
            <span>⚠️</span> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-2 p-3 bg-surface-raised border-t border-surface-border" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 border border-surface-border-hover rounded-lg bg-surface-raised text-gray-100 text-sm focus:outline-none focus:border-indigo-600"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 border-none rounded-lg bg-indigo-600 text-white text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Floating AI button component
interface AIFloatingButtonProps {
  bodyPart: BodyPart;
  onClick: () => void;
}

export function AIFloatingButton({ bodyPart, onClick }: AIFloatingButtonProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const settings = safeGet<AISettings | null>("bodyCoach.settings.ai", null);
    if (settings) {
      setEnabled(settings.enableAIFeatures);
    }
  }, []);

  if (!enabled) return null;

  return (
    <button
      className="fixed bottom-6 right-6 w-14 h-14 border-none rounded-full text-white text-2xl cursor-pointer shadow-lg shadow-indigo-600/40 transition-transform duration-200 hover:scale-110 active:scale-95 z-[100]"
      style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
      onClick={onClick}
      title="Ask AI"
    >
      <span>🤖</span>
    </button>
  );
}

// Quick explain button for exercises
interface ExplainButtonProps {
  exerciseTitle: string;
  exerciseIntent: string;
  bodyPart: BodyPart;
}

export function ExplainButton({ exerciseTitle, exerciseIntent, bodyPart }: ExplainButtonProps) {
  const [showChat, setShowChat] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const settings = safeGet<AISettings | null>("bodyCoach.settings.ai", null);
    if (settings) {
      setEnabled(settings.enableAIFeatures);
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <button
        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-surface-border-hover rounded-md bg-surface-raised text-muted text-xs cursor-pointer transition-all duration-150 hover:bg-[#222226] hover:text-gray-100 hover:border-indigo-600"
        onClick={() => setShowChat(true)}
        title="Explain this exercise"
      >
        <span>💡</span> Explain
      </button>

      {showChat && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[1000]"
          onClick={() => setShowChat(false)}
        >
          <div className="w-full max-w-[480px]" onClick={e => e.stopPropagation()}>
            <AIChat
              bodyPart={bodyPart}
              type="explain_exercise"
              context={{ exerciseTitle, exerciseIntent }}
              initialMessage={`Can you explain the "${exerciseTitle}" exercise and why it might help me?`}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
