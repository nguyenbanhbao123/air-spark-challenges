import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { Send, Mic, Pen, Highlighter, Type } from 'lucide-react';

type CapturePageProps = {
  imageSrc: string;
  onConfirm: (image: string, question: string) => void;
  onCancel: () => void;
};

export const CapturePage: React.FC<CapturePageProps> = ({
  imageSrc,
  onConfirm,
  onCancel,
}) => {
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [question, setQuestion] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (question.trim()) {
          onConfirm(imageSrc, question);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageSrc, question, onConfirm, onCancel]);

  const initializeCropRect = () => {
    if (containerRef.current && imageSrc) {
      const container = containerRef.current;
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(
          container.clientWidth / img.width,
          container.clientHeight / img.height
        );
        const displayWidth = img.width * scale;
        const displayHeight = img.height * scale;
        const displayX = (container.clientWidth - displayWidth) / 2;
        const displayY = (container.clientHeight - displayHeight) / 2;

        setCropRect({
          x: displayX + 20,
          y: displayY + 20,
          width: Math.max(100, displayWidth - 40),
          height: Math.max(100, displayHeight - 40),
        });
      };
      img.src = imageSrc;
    }
  };

  useEffect(() => {
    if (imageSrc) {
      initializeCropRect();
    }
  }, [imageSrc]);

  const getHandleStyle = (handle: string) => {
    const size = 12;
    const pos: Record<string, any> = {
      'nw': { top: -6, left: -6, cursor: 'nw-resize' },
      'ne': { top: -6, right: -6, cursor: 'ne-resize' },
      'sw': { bottom: -6, left: -6, cursor: 'sw-resize' },
      'se': { bottom: -6, right: -6, cursor: 'se-resize' },
    };
    return {
      width: size,
      height: size,
      backgroundColor: 'var(--highlight)',
      border: `2px solid var(--highlight-2)`,
      ...pos[handle],
    };
  };

  const handleMouseDown = (e: MouseEvent, handle: string | null) => {
    e.preventDefault();
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    setDragStart({ x: e.clientX - cropRect.x, y: e.clientY - cropRect.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && resizeHandle) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      let newRect = { ...cropRect };

      if (resizeHandle.includes('e')) newRect.width = Math.max(50, cropRect.width + (dx - (e.clientX - dragStart.x)));
      if (resizeHandle.includes('s')) newRect.height = Math.max(50, cropRect.height + (dy - (e.clientY - dragStart.y)));
      if (resizeHandle.includes('w')) {
        const newWidth = Math.max(50, cropRect.width - (dx - (e.clientX - dragStart.x)));
        newRect.width = newWidth;
        newRect.x = cropRect.x + (cropRect.width - newWidth);
      }
      if (resizeHandle.includes('n')) {
        const newHeight = Math.max(50, cropRect.height - (dy - (e.clientY - dragStart.y)));
        newRect.height = newHeight;
        newRect.y = cropRect.y + (cropRect.height - newHeight);
      }

      setCropRect(newRect);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isDragging) {
      setCropRect({
        ...cropRect,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleSend = () => {
    if (question.trim()) {
      onConfirm(imageSrc, question);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-screen w-screen cursor-crosshair overflow-hidden bg-black/50 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Screen Capture"
          className="absolute inset-0 h-full w-full object-contain [webkit-user-drag:none]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div
        className="absolute border-2 border-[var(--accent)] bg-transparent pointer-events-none"
        style={{
          left: `${cropRect.x}px`,
          top: `${cropRect.y}px`,
          width: `${cropRect.width}px`,
          height: `${cropRect.height}px`,
          boxShadow: `inset 0 0 0 9999px rgba(0, 0, 0, 0.5)`,
        }}
      >
        <div
          className="absolute"
          style={getHandleStyle('nw')}
          onMouseDown={(e) => handleMouseDown(e, 'nw')}
        />
        <div
          className="absolute"
          style={getHandleStyle('ne')}
          onMouseDown={(e) => handleMouseDown(e, 'ne')}
        />
        <div
          className="absolute"
          style={getHandleStyle('sw')}
          onMouseDown={(e) => handleMouseDown(e, 'sw')}
        />
        <div
          className="absolute"
          style={getHandleStyle('se')}
          onMouseDown={(e) => handleMouseDown(e, 'se')}
        />
      </div>

      <div
        className="absolute flex items-center gap-3 rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2 shadow-lg"
        style={{
          left: `${cropRect.x}px`,
          top: `${cropRect.y - 56}px`,
        }}
      >
        <button className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition">
          <Pen size={16} />
          <span className="text-xs font-medium">Pen</span>
        </button>
        <button className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition">
          <Highlighter size={16} />
          <span className="text-xs font-medium">Highlighter</span>
        </button>
        <button className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition">
          <Type size={16} />
          <span className="text-xs font-medium">Text</span>
        </button>
      </div>

      <div
        className="absolute flex items-center gap-3 rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 shadow-lg"
        style={{
          left: `${cropRect.x}px`,
          bottom: `${window.innerHeight - cropRect.y - cropRect.height - 80}px`,
          width: `${cropRect.width}px`,
        }}
      >
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition"
          title="Voice input coming soon"
        >
          <Mic size={16} className="animate-pulse" />
        </button>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about your selection..."
          className="min-w-0 flex-1 bg-transparent text-xs text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <button
          onClick={handleSend}
          disabled={!question.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
