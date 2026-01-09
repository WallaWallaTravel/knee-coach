"use client";

import { useState, useEffect, useRef } from "react";
import { BodyPart } from "@/lib/body-parts/types";

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
    const saved = localStorage.getItem("bodyCoach.settings.ai");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setAiSettings(settings);
      } catch (e) {
        console.error("Failed to parse AI settings");
      }
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
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <h3>AI Assistant</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>
        <div className="ai-not-configured">
          <span className="not-configured-icon">🤖</span>
          <h4>AI Features Not Configured</h4>
          <p>Set up your AI provider in Settings to enable smart features.</p>
          <a href="/settings" className="btn btn-primary">
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>
          {type === "calibration" ? "Smart Calibration" :
           type === "explain_mode" ? "Mode Explanation" :
           type === "explain_exercise" ? "Exercise Guide" :
           type === "analyze_progress" ? "Progress Analysis" :
           type === "explain_red_flag" ? "Safety Guidance" : "AI Assistant"}
        </h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <span className="chat-empty-icon">💬</span>
            <p>
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
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              {msg.content.split("\n").map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>

      <style jsx>{`
        .ai-chat-container {
          display: flex;
          flex-direction: column;
          height: 400px;
          background: #121214;
          border: 1px solid #2a2a2d;
          border-radius: 12px;
          overflow: hidden;
        }

        .ai-chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #1a1a1d;
          border-bottom: 1px solid #2a2a2d;
        }

        .ai-chat-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .close-btn {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 6px;
          background: #2a2a2d;
          color: #9ca3af;
          font-size: 18px;
          cursor: pointer;
        }

        .close-btn:hover {
          background: #3a3a3d;
          color: #f3f4f6;
        }

        .ai-not-configured {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .not-configured-icon {
          font-size: 48px;
          opacity: 0.5;
          margin-bottom: 12px;
        }

        .ai-not-configured h4 {
          margin: 0 0 8px 0;
          color: #9ca3af;
        }

        .ai-not-configured p {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #6b7280;
        }

        .ai-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #6b7280;
        }

        .chat-empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .chat-empty p {
          margin: 0;
          font-size: 14px;
        }

        .chat-message {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2a2a2d;
          border-radius: 8px;
          font-size: 16px;
          flex-shrink: 0;
        }

        .chat-message.assistant .message-avatar {
          background: #312e81;
        }

        .message-content {
          flex: 1;
          padding: 10px 14px;
          background: #1a1a1d;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .chat-message.user .message-content {
          background: #2a2a2d;
        }

        .message-content p {
          margin: 0 0 8px 0;
        }

        .message-content p:last-child {
          margin-bottom: 0;
        }

        .message-content.loading {
          display: flex;
          gap: 4px;
          padding: 14px;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          background: #6b7280;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .chat-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.15);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
        }

        .ai-chat-input {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: #1a1a1d;
          border-top: 1px solid #2a2a2d;
        }

        .ai-chat-input input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #3a3a3d;
          border-radius: 8px;
          background: #121214;
          color: #f3f4f6;
          font-size: 14px;
        }

        .ai-chat-input input:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .ai-chat-input button {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: #4f46e5;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .ai-chat-input button:hover:not(:disabled) {
          background: #4338ca;
        }

        .ai-chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
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
    const saved = localStorage.getItem("bodyCoach.settings.ai");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setEnabled(settings.enableAIFeatures);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!enabled) return null;

  return (
    <button className="ai-floating-btn" onClick={onClick} title="Ask AI">
      <span>🤖</span>
      <style jsx>{`
        .ai-floating-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 100;
        }

        .ai-floating-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(79, 70, 229, 0.5);
        }

        .ai-floating-btn:active {
          transform: scale(0.95);
        }
      `}</style>
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
    const saved = localStorage.getItem("bodyCoach.settings.ai");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setEnabled(settings.enableAIFeatures);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <button 
        className="explain-btn"
        onClick={() => setShowChat(true)}
        title="Explain this exercise"
      >
        <span>💡</span> Explain
        <style jsx>{`
          .explain-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 10px;
            border: 1px solid #3a3a3d;
            border-radius: 6px;
            background: #1a1a1d;
            color: #9ca3af;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .explain-btn:hover {
            background: #222226;
            color: #f3f4f6;
            border-color: #4f46e5;
          }
        `}</style>
      </button>

      {showChat && (
        <div className="explain-modal-overlay" onClick={() => setShowChat(false)}>
          <div className="explain-modal" onClick={e => e.stopPropagation()}>
            <AIChat
              bodyPart={bodyPart}
              type="explain_exercise"
              context={{ exerciseTitle, exerciseIntent }}
              initialMessage={`Can you explain the "${exerciseTitle}" exercise and why it might help me?`}
              onClose={() => setShowChat(false)}
            />
          </div>
          <style jsx>{`
            .explain-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
              z-index: 1000;
            }

            .explain-modal {
              width: 100%;
              max-width: 480px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
