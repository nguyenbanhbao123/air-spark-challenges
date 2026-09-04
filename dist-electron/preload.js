let electron = require("electron");
//#region src/preload.ts
electron.contextBridge.exposeInMainWorld("api", {
	captureRegion: () => electron.ipcRenderer.invoke("capture:region"),
	ask: (image, question, history) => electron.ipcRenderer.invoke("ai:ask", image, question, history),
	saveConversation: (c) => electron.ipcRenderer.invoke("storage:save", c),
	loadConversations: () => electron.ipcRenderer.invoke("storage:loadAll"),
	onOverlayImage: (cb) => {
		electron.ipcRenderer.on("overlay:image", (_e, dataUrl) => cb(dataUrl));
	},
	submitSelection: (rect) => electron.ipcRenderer.send("capture:selection", rect)
});
//#endregion
