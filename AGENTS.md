# AI Screen Snapping — agent instructions

An Electron + TypeScript + React + Tailwind desktop tool: select any region of the screen, ask a
model about it, without leaving what you were doing. Built for the ASU AIR Spark Challenge.

`ARCHITECTURE-NOTES.md` (kept outside this repo — ask your owner for the path) holds the original
team spec: the product flow, priorities, and the five work tracks. Read it for intent. **But this
repo has deliberately moved on from parts of it — section 3 below lists where. Follow this file,
not the spec, wherever they disagree, and never "fix" the code back toward the spec.**

---

## 1. The ASU API firewall — read this first

The model endpoint sits behind a Cloudflare WAF with website-protection rules left switched on.
It scans the body of every request and returns `403 Forbidden` — as an HTML page, not a JSON
error — when it sees certain strings. The block happens before ASU's own gateway, so the model
never sees the request. It is not an auth, key, or network problem.

Trigger strings appear below with a `·` inserted, and `[BT]` standing in for a single backtick,
so that this file does not itself trip the rule. Neither character is in the real string.

### Never emit these, and never read them into the conversation

- `<·script` in any form — opening tag, closing tag, or with a `src=` attribute
- A single-backtick inline code span wrapping a fetch command **plus a target**:
  `[BT]curl -s https://…[BT]`, `[BT]wget https://…[BT]`, `[BT]nslookup some.domain[BT]`.
  The same text without backticks, or inside a fenced block, is fine.
- `/etc/·passwd`, `/etc/·hosts`, `/proc/self/·environ`
- `${j·ndi:ldap://…}`

Everything else is fine and needs no avoidance: `rm -rf`, SQL strings, `<iframe`, `<?php`,
`eval(`, `document.cookie`, `../../../..`, React JSX, Tailwind classes, large payloads,
streaming, tool calls, and backticks around non-network commands such as `ls -la`, `git status`,
`npm install`.

### The one landmine in this repo

**`index.html` in the repo root is the only source file containing a script tag. Never read,
write, edit, or diff it.** That includes opening it to look, globbing and then reading the
results, and running `git diff` on it. It is the Vite entry point and already correct — if it
ever needs changing, say which lines to change and let the human edit it.

Everything under `src/` is `.ts`, `.tsx` and `.css` and is safe to read and edit freely — the
selection overlay is a React component (`RegionCaptureOverlay.tsx`), not an HTML file. Built
output under `dist/` and `dist-electron/` also contains script tags; never read those either.

`git` itself is safe — clone, checkout, commit, push and `gh pr create` all pass. `git diff` is
safe on everything except the files named above.

### If you hit `Forbidden` anyway

The session is unrecoverable. The HTML error page the WAF returns contains script tags, gets
stored in the conversation history, and re-triggers the block on every following request, so
retrying only makes it worse.

Tell the user immediately to start a **new session**, and tell them to run `git status` first —
the 403 lands after files are written and before the commit, so their work is almost always
still on disk.

---

## 2. How this project is actually laid out

```
index.html                      Vite entry. DO NOT TOUCH (script tag).
vite.config.mts                 vite-plugin-electron builds main + preload into dist-electron/
package.json                    main: dist-electron/main.js
src/
  main.ts                       MAIN: creates the window, registers every ipcMain handler,
                                loads http://localhost:5173, calls dotenv.config()
  preload.ts                    the window.api bridge — the only path from renderer to main
  core/types.ts                 shared types: Role, Message, Conversation, Rect
  api/
    ai.ts                       ASU client. ask(image, question, history). Model glm-4-5v.
    storage.ts                  loadAll, getConversation, save, createConversation,
                                deleteConversation — JSON files under Electron userData
  capture/
    captureRegion.ts            MAIN: screen grab, overlay window, crop
    RegionCaptureOverlay.tsx    RENDERER: the drag-to-select overlay
  ui/
    main.tsx  App.tsx  HomePage.tsx  ChatPopup.tsx  SignInPage.tsx  RegisterPage.tsx
    index.css                   Tailwind v4
```

### Process boundary

`main.ts`, `api/` and `capture/captureRegion.ts` run in Electron's **main** process: Node,
filesystem and outbound network. Everything in `ui/`, plus `RegionCaptureOverlay.tsx`, runs in
the sandboxed **renderer**: no Node, no filesystem, no direct network to the ASU API.

They talk only through `window.api`, defined in `preload.ts`. A renderer file must never import
from `api/` or from `captureRegion.ts` — call `window.api` instead. The API key lives in the main
process and must never reach the renderer.

### The IPC contract

`preload.ts` exposes exactly six methods, and `main.ts` registers the matching handlers:

| `window.api` method | channel | handled by |
|---|---|---|
| `captureRegion()` | `capture:region` | `captureRegion()` |
| `ask(image, question, history)` | `ai:ask` | `api/ai.ts` |
| `saveConversation(c)` | `storage:save` | `api/storage.ts` |
| `loadConversations()` | `storage:loadAll` | `api/storage.ts` |
| `onOverlayImage(cb)` | `overlay:image` | pushed by `captureRegion()` |
| `submitSelection(rect)` | `capture:selection` | listened for by `captureRegion()` |

`main.ts` also registers `storage:create`, `storage:delete`, `storage:get` and `get-app-version`,
which `preload.ts` does not yet expose. If the UI needs one, add it to `preload.ts` **and** to the
`Window.api` type in `core/types.ts` in the same change — those three must always agree.

---

## 3. Where this repo has moved on from ARCHITECTURE-NOTES.md

These are current reality, not mistakes. Do not revert them.

- The AI client and storage live in `src/api/`, not `src/services/`.
- The selection overlay is `capture/RegionCaptureOverlay.tsx`, not an `overlay.html`.
- `Message` and `Conversation` in `core/types.ts` have been extended: `Message` gained `id` and
  `createdAt`; `Conversation` gained `title` and `updatedAt`, uses numeric epoch timestamps, and
  no longer carries an `image` field.
- The build is `vite-plugin-electron`, not a separate `tsc` step producing `dist/`.

---

## 4. Commands

```
npm install
npm run dev      # Vite dev server + Electron, via vite-plugin-electron
npm run build    # tsc + vite build
```

## 5. Secrets

The key belongs in a gitignored `.env` in the repo root as `ASU_API_KEY`; `main.ts` loads it with
dotenv. Never commit it, never print it, and never inline a key into source.

`opencode.json` is committed and shared with the team, so **never write an `apiKey` into it** —
a key was removed from that file once already. Personal credentials belong in
`~/.local/share/opencode/auth.json`, which OpenCode falls back to automatically.
