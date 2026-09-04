import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RegionCaptureOverlay } from "../capture/RegionCaptureOverlay";
import { CapturePage } from "../capture/CapturePage";
import './index.css';

// captureRegion() opens a second BrowserWindow on the #/overlay route.
// It loads this same bundle, so decide here which root component it gets.
const isOverlay = window.location.hash === "#/overlay";
const isCapturePage = window.location.hash === "#/capture";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    {isOverlay ? <RegionCaptureOverlay /> : isCapturePage ? <CapturePage imageSrc="" onConfirm={() => {}} onCancel={() => {}} /> : <App />}
  </React.StrictMode>
);