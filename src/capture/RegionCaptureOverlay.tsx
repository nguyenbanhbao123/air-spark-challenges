import React, { useState, useEffect, MouseEvent } from 'react';

export const RegionCaptureOverlay: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    window.api.onOverlayImage((dataUrl: string) => {
      setImageSrc(dataUrl);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.api.submitSelection(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width >= 4 && height >= 4) {
      window.api.submitSelection({ x, y, width, height });
    } else {
      window.api.submitSelection(null);
    }
  };

  const selectionRect = {
    x: Math.min(startPos.x, currentPos.x),
    y: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0 h-screen w-screen cursor-crosshair overflow-hidden bg-black/30 select-none"
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Screen Capture"
          className="absolute inset-0 h-full w-full pointer-events-none select-none [webkit-user-drag:none]"
        />
      )}

      {isDragging && (
        <div
          className="absolute border-2 border-[#0078d4] bg-[#0078d4]/20 pointer-events-none"
          style={{
            left: `${selectionRect.x}px`,
            top: `${selectionRect.y}px`,
            width: `${selectionRect.width}px`,
            height: `${selectionRect.height}px`,
          }}
        />
      )}
    </div>
  );
};