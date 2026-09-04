import { contextBridge, ipcRenderer } from 'electron'
import type { Conversation, Message, Rect } from './core/types'

// The main process sends overlay:image as soon as the overlay window finishes
// loading, which can be before React has mounted and registered its callback.
// Preload runs first, so buffer the value here and replay it on subscribe.
let bufferedOverlayImage: string | null = null
const overlayImageListeners: Array<(dataUrl: string) => void> = []

ipcRenderer.on('overlay:image', (_e, dataUrl: string) => {
  bufferedOverlayImage = dataUrl
  for (const listener of overlayImageListeners) listener(dataUrl)
})

contextBridge.exposeInMainWorld('api', {
  captureRegion: (): Promise<string | null> =>
    ipcRenderer.invoke('capture:region'),

  ask: (image: string, question: string, history: Message[]): Promise<string> =>
    ipcRenderer.invoke('ai:ask', image, question, history),

  saveConversation: (c: Conversation): Promise<void> =>
    ipcRenderer.invoke('storage:save', c),

  loadConversations: (): Promise<Conversation[]> =>
    ipcRenderer.invoke('storage:loadAll'),

  createConversation: (title?: string): Promise<Conversation> =>
    ipcRenderer.invoke('storage:create', title),

  getConversation: (id: string): Promise<Conversation | null> =>
    ipcRenderer.invoke('storage:get', id),

  deleteConversation: (id: string): Promise<void> =>
    ipcRenderer.invoke('storage:delete', id),

  onOverlayImage: (cb: (dataUrl: string) => void): void => {
    overlayImageListeners.push(cb)
    if (bufferedOverlayImage) cb(bufferedOverlayImage)
  },

  submitSelection: (rect: Rect | null): void =>
    ipcRenderer.send('capture:selection', rect)
})