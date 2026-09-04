import { app } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import type { Conversation } from "../core/types";

function getStorageDir(): string {
  return path.join(app.getPath("userData"), "conversations");
}

async function ensureDirectory(): Promise<void> {
  await fs.mkdir(getStorageDir(), { recursive: true });
}

// Get all conversations (sorted newest first)
export async function loadAll(): Promise<Conversation[]> {
  try {
    await ensureDirectory();
    const files = await fs.readdir(getStorageDir());
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const conversations: Conversation[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(getStorageDir(), file);
        const data = await fs.readFile(filePath, "utf-8");
        conversations.push(JSON.parse(data) as Conversation);
      } catch (err) {
        console.error(`Failed to parse conversation file ${file}:`, err);
      }
    }

    // Sort newest to oldest (handles string dates or numeric timestamps)
    return conversations.sort((a, b) => {
      const timeA = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : a.createdAt;
      const timeB = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : b.createdAt;
      return (timeB || 0) - (timeA || 0);
    });
  } catch (err) {
    console.error("Failed to load conversations:", err);
    return [];
  }
}

// Get a single conversation by ID
export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    const filePath = path.join(getStorageDir(), `${id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as Conversation;
  } catch {
    return null;
  }
}

// Save or Update a conversation
export async function save(conversation: Conversation): Promise<void> {
  await ensureDirectory();
  
  const updatedConversation: Conversation = {
    ...conversation,
    updatedAt: Date.now(),
  };

  const filePath = path.join(getStorageDir(), `${updatedConversation.id}.json`);
  await fs.writeFile(
    filePath,
    JSON.stringify(updatedConversation, null, 2),
    "utf-8"
  );
}

// Create a new empty conversation
export async function createConversation(title = "New Conversation"): Promise<Conversation> {
  const now = Date.now();
  const conversation: Conversation = {
    id: crypto.randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  await save(conversation);
  return conversation;
}

// Delete a conversation by ID
export async function deleteConversation(id: string): Promise<void> {
  try {
    const filePath = path.join(getStorageDir(), `${id}.json`);
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Failed to delete conversation ${id}:`, err);
  }
}