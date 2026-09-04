import React, { useState, useEffect, MouseEvent } from 'react';
import { CapturePage } from './CapturePage';

type Phase = 'selecting' | 'editing';

/**
 * Lives in the overlay BrowserWindow that captureRegion() opens.
 *
 * Two phases:
 *   selecting — drag a rectangle over the frozen screenshot
 *   editing   — the selection is cropped and handed to CapturePage, where the
 *               user adjusts it and types the question. Nothing reaches the
 *               model until they send from there.
 */
export const RegionCaptureOverlay: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [phase, setPhase] = useState<Phase>('selecting');
  const [croppedSrc, setCroppedSrc] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    window.api.onOverlayImage((dataUrl: string) => {
      setImageSrc(dataUrl);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.api.submitCapture(null, '');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** Crop the frozen screenshot to the dragged rectangle, in device pixels. */
  const cropToDataUrl = (rect: { x: number; y: number; width: number; height: number }): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // The screenshot is captured at the display's scale factor, so map CSS
        // pixels on this overlay to pixels in the source image.
        const scaleX = img.width / window.innerWidth;
        const scaleY = img.height / window.innerHeight;

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(rect.width * scaleX));
        canvas.height = Math.max(1, Math.round(rect.height * scaleY));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        ctx.drawImage(
          img,
          Math.round(rect.x * scaleX),
          Math.round(rect.y * scaleY),
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    // Too small to be a deliberate selection — stay in selecting mode.
    if (width < 4 || height < 4) return;

    const cropped = await cropToDataUrl({ x, y, width, height });
    setCroppedSrc(cropped);
    setPhase('editing');
  };

  const selectionRect = {
    x: Math.min(startPos.x, currentPos.x),
    y: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  };

  if (phase === 'editing') {
    return (
      <CapturePage
        imageSrc={croppedSrc}
        onConfirm={(image, question) => window.api.submitCapture(image, question)}
        onCancel={() => window.api.submitCapture(null, '')}
      />
    );
  }

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
          className="absolute border-2 border-[#1B6EF3] bg-[#1B6EF3]/20 pointer-events-none"
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
