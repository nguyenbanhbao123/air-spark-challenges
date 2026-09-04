  # Snapper AI

  Select any region of your screen and ask an AI about it without leaving what you are doing. Snapper AI is an Electron desktop app built with TypeScript, React, and Tailwind for the ASU AIR Spark Challenge.

  ![ASU AIR Spark Hackathon](https://img.shields.io/badge/ASU_AIR-Spark_Hackathon-gold?style=for-the-badge)
  ![Electron](https://img.shields.io/badge/Electron-44-blue?style=for-the-badge&logo=electron)
  ![React](https://img.shields.io/badge/React-19-cyan?style=for-the-badge&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)

  ## Features

  - Capture a screen region from the app or with the global `Alt + S` shortcut.
  - Frame the capture, review it, and include a question before sending.
  - Ask follow-up questions in a multi-turn AI chat.
  - Persist conversations locally through Electron's user-data storage.
  - Use ASU AIR's vision API directly from Electron's main process; the API key never reaches the renderer.

  ## Quick start

  ### Prerequisites

  - Node.js 20 or newer
  - Git

  ### Install

  ```bash
  git clone https://github.com/nguyenbanhbao123/air-spark-hackathon.git
  cd air-spark-hackathon
  npm install
  ```

  ### Configure the API key

  Copy the example environment file, then replace the placeholder with your ASU AIR API key:

  ```bash
  cp .env.example .env
  ```

  On Windows PowerShell, use `Copy-Item .env.example .env` instead. Get an API key from `voyager.rc.asu.edu` under *Non-HPC / LLM API access*. Do not commit your `.env` file.

  ### Build

  Create a production build and run the TypeScript and Vite checks:

  ```bash
  npm run build
  ```

  The build output is written to `dist/` and `dist-electron/`.

  ### Run

  ```bash
  npm run dev
  ```

  The Electron window opens automatically. No Python or separate backend service is required.

  ## How to use

  | Action | How |
  | --- | --- |
  | Capture from anywhere | Press `Alt + S` while another app is focused. |
  | Capture from the app | Click **Get Started** on the home screen. |
  | Frame a shot | Drag a rectangle in the selection overlay, then release. |
  | Ask a question | Type it in the capture review screen and press `Enter` or select **Send**. |
  | Cancel a capture | Press `Esc`. |

  After you send a capture, the chat opens with the image and question ready to go. The app remains resident after its window closes so the global shortcut continues to work; quit it from the terminal that launched it.

  ## Project structure

  ```text
  src/
    main.ts                         Electron main process, IPC, and Alt+S shortcut
    preload.ts                      Secure window.api bridge
    core/types.ts                   Shared TypeScript types
    api/
      ai.ts                         ASU AIR vision client (glm-4-5v)
      storage.ts                    Local conversation storage
    capture/
      captureRegion.ts              Screen capture and overlay-window manager
      RegionCaptureOverlay.tsx      Region selection and capture review UI
      CapturePage.tsx               Capture review and question UI
    ui/
      App.tsx                       Main React application
      HomePage.tsx                  Home screen
      ChatPopup.tsx                 AI conversation screen
      SignInPage.tsx                Sign-in screen
      RegisterPage.tsx              Registration screen
      index.css                     Tailwind styling
  ```

  ## Notes and troubleshooting

  - **Annotations:** the review screen shows Pen, Highlighter, and Text controls, but they are currently disabled placeholders.
  - **`Alt + S` does nothing:** another application may own the shortcut. Check the terminal for the registration warning and change the binding in `src/main.ts` if needed.
  - **Questions time out on ASU campus Wi-Fi:** campus DNS may resolve the API gateway to an unreachable internal address. Configure system DNS to `1.1.1.1` or `8.8.8.8`, then restart the app.
  - **A question returns 403:** the ASU endpoint firewall can reject request text matching its website-protection rules. See `OPENCODE-403-NOTES.md` for the project-specific details.
  - **macOS screenshots are blank:** grant Screen Recording permission to Electron or the launching terminal in **System Settings > Privacy & Security > Screen Recording**, then restart the app.

  ## Scripts

  ```bash
  npm run dev
  npm run build
  npm run preview
  ```

  ## License

  Built for the ASU AIR Spark Hackathon.
