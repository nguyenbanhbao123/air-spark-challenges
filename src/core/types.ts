export type Role = 'user' | 'assistant'

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

declare global {
  interface Window {
    api: {
      captureRegion(): Promise<string | null>;
      ask(image: string, question: string, history: Message[]): Promise<string>;
      saveConversation(c: Conversation): Promise<void>;
      loadConversations(): Promise<Conversation[]>;
      onOverlayImage(cb: (dataUrl: string) => void): void;
      submitSelection(rect: Rect | null): void;
    };
  }
}