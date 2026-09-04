import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';
import path from 'node:path';
import type { CaptureResult } from '../core/types';

export async function captureRegion(): Promise<CaptureResult | null> {
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

  // The overlay crops the selection itself and only reports back once the user
  // has framed the shot and sent their question from the capture page.
  const result = await new Promise<CaptureResult | null>((resolve) => {
    ipcMain.once('capture:submit', (_event, image: string | null, question: string) => {
      resolve(image ? { image, question } : null);
    });

    overlay.once('closed', () => resolve(null));
  });

  if (!overlay.isDestroyed()) overlay.close();

  return result;

}