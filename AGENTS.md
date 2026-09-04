# AI Screen Snapping — agent instructions

An Electron + TypeScript + React desktop tool: select any region of the screen, ask a model
about it, without leaving what you were doing. Built for the ASU AIR Spark Challenge.

The full spec — flow, priorities, repository structure, frozen types, the IPC contract, and the
five work tracks — lives in `ARCHITECTURE-NOTES.md`, kept **outside** this repo. Ask your owner
for the path if you do not have it. Read it before writing code.

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
`eval(`, `document.cookie`, `../../../..`, React JSX, large payloads, streaming, tool calls, and
backticks around non-network commands such as `ls -la`, `git status`, `npm install`.

### The rule that follows

**Do not read, write, edit, or diff any `.html` file in this repo.** Every one of them contains
a script tag. `src/ui/index.html` and `src/capture/overlay.html` are both landmines. This
includes opening one to look, globbing and then reading the results, and running `git diff` on
one. If an `.html` file needs changing, say which lines to change and let the human edit it.

`git` itself is safe — clone, checkout, commit, push and `gh pr create` all pass. `git diff` is
safe only on non-HTML files.

### If you hit `Forbidden` anyway

The session is unrecoverable. The HTML error page the WAF returns contains script tags, gets
stored in the conversation history, and re-triggers the block on every following request, so
retrying only makes it worse.

Tell the user immediately to start a **new session**, and tell them to run `git status` first —
the 403 lands after files are written and before the commit, so their work is almost always
still on disk.

---

## 2. Stay inside your owner's track

The work is split into five tracks, A through E, each with an explicit file list in
`ARCHITECTURE-NOTES.md` sections 9–13. Your owner has claimed exactly one.

- **Do not create or edit files outside that track.** If your owner needs something that lives
  in another track's folder, it belongs in `core/` — say so, and let them raise it in the team
  channel rather than reaching across.
- **The interfaces in sections 6 and 7 are frozen.** `src/core/types.ts` and the `window.api`
  IPC contract are coded against by every other track. Never change a name, a signature, or an
  IPC channel string. If one genuinely has to change, stop and tell your owner to agree it in
  the channel first.
- `core/` imports nothing. `capture/`, `services/` and `ui/` import only from `core/`. No module
  imports from a sibling. Only `main.ts` imports from everything.

## 3. Process boundary

Electron's main process (`main.ts`, `capture/`, `services/`) has Node, filesystem, and network
access. The renderer (`ui/`) is sandboxed React with none of those — it reaches the main process
only through `window.api`, defined in `preload.ts`. The API key lives in the main process and
must never reach the renderer.

## 4. Commands

```
npm install
npm run dev      # Vite + Electron in dev mode
npm run build    # production build
```

A gitignored `.env` in the repo root holds `ASU_API_KEY`. Never commit it, never print it, and
never inline a key into source.
