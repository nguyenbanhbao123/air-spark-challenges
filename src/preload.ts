import { contextBridge, ipcRenderer } from 'electron'
import type { Conversation, Message, Rect } from './core/types'

contextBridge.exposeInMainWorld('api', {
  captureRegion: (): Promise<string | null> =>
    ipcRenderer.invoke('capture:region'),

  ask: (image: string, question: string, history: Message[]): Promise<string> =>
    ipcRenderer.invoke('ai:ask', image, question, history),

  saveConversation: (c: Conversation): Promise<void> =>
    ipcRenderer.invoke('storage:save', c),

  loadConversations: (): Promise<Conversation[]> =>
    ipcRenderer.invoke('storage:loadAll'),

  onOverlayImage: (cb: (dataUrl: string) => void): void => {
    ipcRenderer.on('overlay:image', (_e, dataUrl: string) => cb(dataUrl))
  },

  submitSelection: (rect: Rect | null): void =>
    ipcRenderer.send('capture:selection', rect)
})