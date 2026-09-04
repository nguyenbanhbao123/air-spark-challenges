import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';
import path from 'node:path';
import type { Rect } from '../core/types';

export async function captureRegion(): Promise<string | null> {
  const display = screen.getPrimaryDisplay();
  const scale = display.scaleFactor;

  // 1. Take full display screenshot
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: Math.round(display.size.width * scale),
      height: Math.round(display.size.height * scale),
    },
  });
  const shot = sources[0].thumbnail;

  // 2. Create fullscreen overlay window
  const overlay = new BrowserWindow({
    ...display.bounds,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load Vite dev server URL or build path (hash route or overlay route)
  if (process.env.VITE_DEV_SERVER_URL) {
    await overlay.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/overlay`);
  } else {
    await overlay.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/overlay',
    });
  }

  // 3. Send the image, then await the selection from the React component.
  // loadURL/loadFile above already resolves on did-finish-load, so listening for
  // that event here would attach too late and never fire. Send it directly —
  // preload buffers the value, so it is safe to send before React mounts.
  overlay.webContents.send('overlay:image', shot.toDataURL());

  const rect = await new Promise<Rect | null>((resolve) => {
    ipcMain.once('capture:selection', (_event, selectionRect: Rect | null) => {
      resolve(selectionRect);
    });

    overlay.once('closed', () => resolve(null));
  });

  if (!overlay.isDestroyed()) overlay.close();

  if (!rect || rect.width < 4 || rect.height < 4) return null;

  // 4. Crop screen capture using selection bounds adjusted for display scale
  const cropped = shot.crop({
    x: Math.round(rect.x * scale),
    y: Math.round(rect.y * scale),
    width: Math.round(rect.width * scale),
    height: Math.round(rect.height * scale),
  });

  return cropped.toDataURL();
}