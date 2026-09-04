import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import * as path from "path";
import dotenv from "dotenv";

import type { Message } from "./core/types";
import { ask } from "./api/ai";
import {
  createConversation,
  deleteConversation,
  getConversation,
  loadAll,
  save,
} from "./api/storage";
import { captureRegion } from "./capture/captureRegion";

dotenv.config();

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load dev server URL or local HTML
  mainWindow.loadURL("http://localhost:5173").catch((err) => {
    console.error("Failed to load renderer URL:", err);
  });

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function bringMainWindowToFront(): void {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
}

// Register IPC Handlers
function registerIpcHandlers(): void {
  // App Info
  ipcMain.handle("get-app-version", () => app.getVersion());

  // Screenshot Capture
  ipcMain.handle("capture:region", async () => {
    return await captureRegion();
  });

  // AI Service
  ipcMain.handle(
    "ai:ask",
    async (_event, imageBase64: string, question: string, history: Message[] = []) => {
      return await ask(imageBase64, question, history);
    }
  );

  // Inside registerIpcHandlers():
  ipcMain.handle("storage:save", (_event, conversation) => save(conversation));
  ipcMain.handle("storage:loadAll", () => loadAll());
  ipcMain.handle("storage:create", (_event, title?: string) => createConversation(title));
  ipcMain.handle("storage:delete", (_event, id: string) => deleteConversation(id));
  ipcMain.handle("storage:get", (_event, id: string) => getConversation(id));
}

function registerGlobalShortcuts(): void {
  const registered = globalShortcut.register("Alt+S", async () => {
    console.log("Alt+S pressed - starting capture");
    const result = await captureRegion();
    if (result && mainWindow) {
      mainWindow.webContents.send("capture:completed", result);
      bringMainWindowToFront();
    }
  });

  if (!registered) {
    console.warn("Failed to register Alt+S global shortcut - it may already be in use by another application.");
  }
}

function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll();
}

// App Lifecycle
app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  registerGlobalShortcuts();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("will-quit", () => {
  unregisterGlobalShortcuts();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
