# Snapper AI

Select any region of your screen and ask an AI about it, without leaving what you are doing.
Electron + TypeScript + React + Tailwind, running on the ASU AIR platform.

---

## Running it — start to finish

You need **Node.js 20 or newer** and **git**. Nothing else.

```bash
git clone https://github.com/nguyenbanhbao123/air-spark-challenges.git
cd air-spark-challenges
npm install
```

### Then the step everyone forgets

**The repo does not contain an API key.** `.env` is gitignored, so a fresh clone has no key and
every question will fail with `ASU_API_KEY is not set`.

Copy the example and paste your own key:

```bash
cp .env.example .env      # Windows: copy .env.example .env
```

Then open `.env` and replace the placeholder with your ASU AIR key. If you do not have one, get
it from `voyager.rc.asu.edu` under *Non-HPC / LLM API access* — it is self-service and instant,
but Voyager itself needs the ASU VPN. The API the app calls does **not** need the VPN.

### Start it

```bash
npm run dev
```

A window opens. That is it.

---

## Using it

| Action | How |
|---|---|
| **Capture from anywhere** | Press **Alt + S** — works while any other app is focused |
| Capture from the app | Click **Get Started** on the home screen |
| Frame the shot | Drag a rectangle, then release |
| Ask | Type in the bar under the snippet, press **Enter** |
| Cancel | **Esc** |

After you send, the chat opens with your screenshot and your question already on its way.

The app **keeps running when you close the window** so that Alt + S still works. Press Alt + S
again and the window comes back. To quit properly, stop it from the terminal you started it in.

---

## If something does not work

**Every question times out, and the error mentions `10.139.x.x`**
You are on ASU campus wifi. ASU's DNS resolves the API to an internal address the wireless
network cannot reach. Set your DNS to `1.1.1.1` and `8.8.8.8` and restart the app. The API
gateway itself is public.

**Alt + S does nothing**
Another application already owns that shortcut. The terminal will have logged
`Failed to register Alt+S global shortcut`. Change the binding in `src/main.ts`.

**A question fails with `403 Forbidden`**
The ASU endpoint sits behind a firewall that rejects requests whose text contains certain
patterns. See `OPENCODE-403-NOTES.md`. It affects AI coding assistants far more than it affects
this app.

**macOS: the screenshot is blank**
Grant screen-recording permission to your terminal or to Electron in
*System Settings → Privacy & Security → Screen Recording*, then restart the app.

---

## How it is put together

```
index.html              Vite entry
src/
  main.ts               MAIN: window, IPC handlers, the Alt+S global shortcut
  preload.ts            the window.api bridge — the only route from renderer to main
  core/types.ts         shared types
  api/ai.ts             ASU API client (model: glm-4-5v)
  api/storage.ts        conversations saved as JSON under Electron userData
  capture/
    captureRegion.ts    MAIN: screen grab, overlay window
    RegionCaptureOverlay.tsx   drag to select
    CapturePage.tsx     review the snippet, annotate, ask
  ui/                   home screen, chat, sign-in, register
```

`AGENTS.md` holds the working agreements and the firewall constraint — read it before pointing an
AI assistant at this repo.
