import React, { useState, useEffect } from 'react';
import { Send, Mic, Pen, Highlighter, Type } from 'lucide-react';

type CapturePageProps = {
  imageSrc: string;
  onConfirm: (image: string, question: string) => void;
  onCancel: () => void;
};

/**
 * The review step, shown in the overlay window once a region has been grabbed.
 *
 * The snippet is displayed at its own size — never blown up to fill the screen —
 * with the annotation toolbar above it and the prompt bar below. Nothing is sent
 * to the model until the user confirms from here.
 */
export const CapturePage: React.FC<CapturePageProps> = ({
  imageSrc,
  onConfirm,
  onCancel,
}) => {
  const [question, setQuestion] = useState('');
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // The screenshot is in device pixels; show it at its true CSS size, only
  // scaling down if the snippet is larger than the space available.
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const dpr = window.devicePixelRatio || 1;
    const naturalW = img.naturalWidth / dpr;
    const naturalH = img.naturalHeight / dpr;

    const maxW = window.innerWidth * 0.8;
    const maxH = window.innerHeight * 0.6;
    const scale = Math.min(1, maxW / naturalW, maxH / naturalH);

    setSize({ w: Math.round(naturalW * scale), h: Math.round(naturalH * scale) });
  };

  const send = () => {
    if (question.trim()) onConfirm(imageSrc, question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const bracket = 'absolute h-5 w-5 border-[var(--accent)] pointer-events-none';

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-black/45 select-none">

      {/* Annotation toolbar — present for layout; the tools are not wired up yet. */}
      <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 shadow-lg">
        {[
          { icon: <Pen size={15} />, label: 'Pen' },
          { icon: <Highlighter size={15} />, label: 'Highlighter' },
          { icon: <Type size={15} />, label: 'Text' },
        ].map((tool) => (
          <button
            key={tool.label}
            disabled
            title={`${tool.label} — coming soon`}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[var(--text-muted)] opacity-50 cursor-not-allowed"
          >
            {tool.icon}
            <span className="text-xs font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* The snippet, at its own size, with corner brackets. */}
      <div
        className="relative"
        style={size ? { width: size.w, height: size.h } : undefined}
      >
        <img
          src={imageSrc}
          alt="Captured region"
          onLoad={handleImageLoad}
          style={size ? { width: size.w, height: size.h } : { maxWidth: '80vw', maxHeight: '60vh' }}
          className="block rounded-sm shadow-2xl [webkit-user-drag:none]"
        />
        <span className={`${bracket} -left-1.5 -top-1.5 border-l-2 border-t-2`} />
        <span className={`${bracket} -right-1.5 -top-1.5 border-r-2 border-t-2`} />
        <span className={`${bracket} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
        <span className={`${bracket} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} />
      </div>

      {/* Prompt bar — matches the snippet's width so the whole thing reads as one object. */}
      <div
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-lg"
        style={{ width: size ? Math.max(size.w, 320) : 420 }}
      >
        <button
          title="Voice input coming soon"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--accent)] transition hover:bg-[var(--surface-2)]"
        >
          <Mic size={16} className="animate-pulse" />
        </button>

        <input
          type="text"
          autoFocus
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about this selection..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
        />

        <button
          onClick={send}
          disabled={!question.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-2)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </div>

      <p className="text-xs text-white/70">Press Enter to send · Esc to cancel</p>
    </div>
  );
};
