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

/** What a completed capture hands back: the framed image and the question asked with it. */
export type CaptureResult = {
  image: string;
  question: string;
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
      captureRegion(): Promise<CaptureResult | null>;
      ask(image: string, question: string, history: Message[]): Promise<string>;
      saveConversation(c: Conversation): Promise<void>;
      loadConversations(): Promise<Conversation[]>;
      createConversation(title?: string): Promise<Conversation>;
      getConversation(id: string): Promise<Conversation | null>;
      deleteConversation(id: string): Promise<void>;
      onOverlayImage(cb: (dataUrl: string) => void): void;
      submitSelection(rect: Rect | null): void;
      submitCapture(image: string | null, question: string): void;
      onCaptureCompleted(cb: (result: CaptureResult) => void): void;
    };
  }
}