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
  image: string;
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
      createConversation(title?: string): Promise<Conversation>;
      getConversation(id: string): Promise<Conversation | null>;
      deleteConversation(id: string): Promise<void>;
      onOverlayImage(cb: (dataUrl: string) => void): void;
      submitSelection(rect: Rect | null): void;
    };
  }
}