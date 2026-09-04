import {
  ArrowUp,
  Minus,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Conversation, Message } from "../core/types";

type ChatPopupProps = {
  conversation: Conversation;
  onConversationUpdate: (updatedConversation: Conversation) => void;
  onClose: () => void;
};

export default function ChatPopup({
  conversation,
  onConversationUpdate,
  onClose,
}: ChatPopupProps) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save conversation when it changes
  useEffect(() => {
    if (conversation) {
      window.api.saveConversation(conversation).catch(err => {
        console.error("Failed to save conversation:", err);
      });
    }
  }, [conversation]);

  const handleSend = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      createdAt: Date.now(),
    };

    const updatedConversation: Conversation = {
      ...conversation,
      title: question.substring(0, 30) + (question.length > 30 ? "..." : ""),
      messages: [...conversation.messages, userMessage],
    };

    onConversationUpdate(updatedConversation);
    setQuestion("");
    setIsLoading(true);
    setError(null);

    try {
      const answer = await window.api.ask(conversation.image, question, conversation.messages);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        createdAt: Date.now(),
      };

      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      };

      onConversationUpdate(finalConversation);
    } catch (err) {
      console.error("Ask failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred while getting the answer.";
      setError(errorMessage);
      
      // Remove the user message if the ask failed
      const revertedConversation: Conversation = {
        ...conversation,
        messages: conversation.messages,
      };
      onConversationUpdate(revertedConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMinimize = () => {
    // For now, minimize just does nothing or could be implemented to minimize the chat
    console.log("Chat minimized");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-[320px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <Sparkles size={14} />
          </div>

          <span className="text-sm font-semibold text-[var(--text)]">
            Snapper AI
          </span>
        </div>

        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <button 
            onClick={handleMinimize}
            className="transition hover:text-[var(--text)]"
          >
            <Minus size={15} />
          </button>

          <button 
            onClick={onClose}
            className="transition hover:text-[var(--text)]"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4 max-h-[400px] overflow-y-auto">
        {/* Screenshot preview */}
        {conversation.image && (
          <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)]">
            <img 
              src={conversation.image} 
              alt="Captured screenshot" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Messages list */}
        {conversation.messages.length === 0 && (
          <div className="text-center text-xs text-[var(--text-muted)]">
            Ask a question about your screenshot
          </div>
        )}

        {conversation.messages.map((msg: Message) => (
          <div 
            key={msg.id} 
            className={msg.role === "user" ? "ml-6 rounded-xl bg-[var(--surface-2)] p-3" : "flex gap-2"}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Sparkles size={14} />
              </div>
            )}
            
            <div className={msg.role === "user" ? "" : "rounded-xl bg-[var(--surface-2)] p-3 flex-1"}>
              <p className="text-xs leading-5 text-[var(--text)] whitespace-pre-wrap">
                {msg.content}
              </p>
              <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Error message */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-xs leading-5 text-red-600">
              Error: {error}
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Sparkles size={14} />
            </div>
            <div className="rounded-xl bg-[var(--surface-2)] p-3 flex-1">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your screen..."
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            disabled={isLoading}
          />

          <button 
            onClick={handleSend}
            disabled={isLoading || !question.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white transition hover:bg-[var(--accent-2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
