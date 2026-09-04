import {
  ArrowUp,
  Plus,
  Menu,
  X,
  Sparkles,
  Settings,
  UserRound,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Conversation, Message } from "../core/types";

type ChatPopupProps = {
  /** Typed on the capture page — sent once, automatically, as the chat opens. */
  initialQuestion?: string;
  conversation: Conversation;
  onConversationUpdate: (updatedConversation: Conversation) => void;
  onClose: () => void;
};

export default function ChatPopup({
  initialQuestion,
  conversation,
  onConversationUpdate,
  onClose,
}: ChatPopupProps) {
  const [question, setQuestion] = useState(initialQuestion ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const sentInitial = useRef(false);

  // Save the conversation whenever it changes.
  useEffect(() => {
    if (conversation) {
      window.api.saveConversation(conversation).catch((err) => {
        console.error("Failed to save conversation:", err);
      });
    }
  }, [conversation]);

  const sendQuestion = async (text: string) => {
    const asked = text.trim();
    if (!asked || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: asked,
      createdAt: Date.now(),
    };

    const updatedConversation: Conversation = {
      ...conversation,
      title: asked.substring(0, 30) + (asked.length > 30 ? "..." : ""),
      messages: [...conversation.messages, userMessage],
    };

    onConversationUpdate(updatedConversation);
    setQuestion("");
    setIsLoading(true);
    setError(null);

    try {
      const answer = await window.api.ask(conversation.image, asked, conversation.messages);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        createdAt: Date.now(),
      };

      onConversationUpdate({
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      });
    } catch (err) {
      console.error("Ask failed:", err);
      setError(err instanceof Error ? err.message : "Something went wrong getting the answer.");
      onConversationUpdate({ ...conversation, messages: conversation.messages });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    void sendQuestion(question);
  };

  // A capture arrives with its question already typed on the capture page.
  useEffect(() => {
    if (!sentInitial.current && initialQuestion && initialQuestion.trim()) {
      sentInitial.current = true;
      void sendQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const time = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col bg-[var(--bg)]">

      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-3 py-3">
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menu"
          className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <Sparkles size={12} />
          </div>
          <span className="text-sm font-semibold text-[var(--text)]">Snapper AI</span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <X size={18} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {conversation.image && (
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <img src={conversation.image} alt="Captured screenshot" className="block h-auto w-full" />
          </div>
        )}

        {conversation.messages.length === 0 && !isLoading && (
          <p className="text-center text-xs text-[var(--text-muted)]">
            Ask a question about your screenshot
          </p>
        )}

        {conversation.messages.map((msg: Message) => (
          <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex gap-2"}>
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Sparkles size={13} />
              </div>
            )}
            <div
              className={
                msg.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--accent)] px-3 py-2"
                  : "max-w-[85%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              }
            >
              <p
                className={
                  msg.role === "user"
                    ? "whitespace-pre-wrap text-xs leading-5 text-white"
                    : "whitespace-pre-wrap text-xs leading-5 text-[var(--text)]"
                }
              >
                {msg.content}
              </p>
              <p className={msg.role === "user" ? "mt-1 text-[10px] text-white/70" : "mt-1 text-[10px] text-[var(--text-muted)]"}>
                {time(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3">
            <p className="text-xs leading-5 text-red-700">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Sparkles size={13} />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="relative shrink-0 border-t border-[var(--border)] p-3">
        {isPlusOpen && (
          <div className="absolute bottom-16 left-3 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            {["Take a screenshot", "Attach a file"].map((label) => (
              <button
                key={label}
                disabled
                className="block w-full px-3 py-2.5 text-left text-xs text-[var(--text-muted)] opacity-60 cursor-not-allowed"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5">
          <button
            onClick={() => setIsPlusOpen((v) => !v)}
            aria-label="Add"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <Plus size={17} />
          </button>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a follow-up..."
            disabled={isLoading}
            className="min-w-0 flex-1 bg-transparent px-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || !question.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>

      {/* Sidebar — presentation only for now. */}
      {isMenuOpen && (
        <>
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="text-sm font-semibold text-[var(--text)]">Snapper AI</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Conversations
              </p>
              {[conversation.title || "Current conversation", "Error in build output", "What does this chart show?"].map((title, i) => (
                <button
                  key={i}
                  disabled
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-[var(--text)] opacity-70 cursor-not-allowed hover:bg-[var(--surface-2)]"
                >
                  <MessageSquare size={13} className="shrink-0 text-[var(--text-muted)]" />
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-[var(--border)] p-3">
              {[
                { icon: <Settings size={14} />, label: "Settings" },
                { icon: <UserRound size={14} />, label: "Account" },
              ].map((item) => (
                <button
                  key={item.label}
                  disabled
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-[var(--text)] opacity-70 cursor-not-allowed hover:bg-[var(--surface-2)]"
                >
                  <span className="text-[var(--text-muted)]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
