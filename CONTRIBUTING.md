# 🤝 Contributing to WhisperIsland

First off, thank you for considering contributing to **WhisperIsland**! It's people like you who make the open-source community such an amazing ecosystem for creating lightweight, premium software utilities.

Please take a moment to review this document to ensure your contributions align with the project's styling, performance, and architectural guidelines.

---

## 🎨 Core Design Principles

WhisperIsland is built to look and feel like an organic part of the operating system. We adhere to these styling pillars:

1. **Vanilla & Lightweight**: We use pure, vanilla HTML, CSS, and JS. Avoid introducing heavy packages, bundling systems, or frameworks (like React or Tailwind) unless absolutely necessary.
2. **Glassmorphism & Rich Aesthetics**: The UI is built using advanced backdrop-filters, custom saturation, and subtle ambient glows. Always use cohesive HSL-tailored colors and smooth cubic-bezier transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) to maintain a premium feel.
3. **Dynamic Interactivity**: Elements should feel "alive" and reactive. Use micro-animations, hover scaling, and real-time auditory oscillator sweeps to enhance engagement.

---

## 🏗️ Electron IPC Architecture

WhisperIsland strictly segregates operating system interactions from UI rendering for maximum speed and security.

- **Main Process (`main.js`)**: Handles native OS hooks, global system hotkeys, system tray registration, filesystem config read/writes, and executing administrative PowerShell commands.
- **Preload Script (`preload.js`)**: Serves as a safe, isolated `contextBridge` that registers limited API hooks on `window.api`. **Never expose raw `ipcRenderer` or Node built-ins directly to the renderer.**
- **Renderer (`src/renderer.js`)**: Manages browser-level components (microphone buffers, canvas visualizers, network Groq API calls). It should trigger actions on the OS exclusively by calling `window.api.method()`.

---

## 💻 Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/whisper-island.git
   cd whisper-island
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```

### 🛠️ Developer Auditing tools
During development, Chrome Developer Tools (DevTools) is set to automatically open in a detached window on startup. 
- You can inspect console logs or network payloads directly inside the DevTools console.
- In `main.js`, you can verify that focus changes and blur triggers do not prematurely hide the window by reviewing the `blur` event guard: `!mainWindow.webContents.isDevToolsOpened()`.

---

## 📝 Coding Guidelines

- **Maintain Comments**: Keep inline documentation explaining complex mathematical canvas loops, frequency sweep oscillators, and clipboard paste schedules.
- **Asynchronous Execution Safety**: When working with media recording and playback hardware, ensure that track termination is wrapped in secure asynchronous event closures (like `mediaRecorder.onstop`).
- **Path Portability**: Always use `path.join(__dirname, ...)` to ensure that all asset directories resolve correctly across different Windows installation environments.

---

## 🚀 Pull Request Checklist

Before submitting a Pull Request, please ensure:
1. The code runs without uncaught syntax or permission exceptions in the DevTools console.
2. Your changes are fully responsive on small and large DPI Windows scaling contexts.
3. No redundant Node dependencies are introduced to `package.json`.
4. Git commit messages follow standard, human-readable guidelines (e.g. `feat: add custom model selection in UI` or `fix: resolve sound sweep audio context suspension`).

Thank you for helping us make WhisperIsland the best dictation capsule on Windows! ⭐
