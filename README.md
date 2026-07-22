# Sapflight-AI 🚀

## 📦 Project Overview

Sapflight-AI is a local AI chat focused on flight-related interactions.
It runs using **Node.js + Express** and connects to a **local LLM (such as Llama via Ollama or LM Studio)** on the same network.

This allows the application to work **without paid APIs**, using your own computer as the AI server.

---

## 🧠 How It Works

- 📱 The client runs on Android (Termux + Acode).
- 🖥️ The AI model runs on your PC.
- 🔌 The server connects to the model using a custom OpenAI-compatible API.

---

## ⚙️ Requirements

Before running the project, install the dependencies:

```bash
npm install
```

### 🔹 Local AI (IMPORTANT)

Local AI support is currently being improved and expanded.

---

## ▶️ Run the Project

Start the server:

```bash
node server.js
```

Then open your browser and go to:

```
http://localhost:3000
```

---

## ⚡ Optional: Electron (Desktop Only)

This project includes Electron files for desktop builds.

To build the desktop version:

```bash
npm install --save-dev electron-builder
npm run build
npm run dist
```

The output files will be available in the `dist/` folder.

> **Note:** Electron is **not required** for Android.

---

## ⚠️ Notes

- Make sure your `baseURL` points to your PC's local IP address.

Example:

```
http://192.168.x.x:11434/v1
```

- Both devices must be connected to the same network.
- The recommended Node.js version is **24.x LTS**.

---

## 🛠️ Known Issues

- I am currently fixing a few bugs discovered during testing.
- One of these bugs may cause the application to display an unexpected shutdown screen.
- This issue will be fixed in a future update.

---

## 💡 Troubleshooting

If something goes wrong, try reinstalling the dependencies:

```bash
npm install
```

Then restart the server and make sure your AI model is running correctly.

---

## 📄 License

Sapflight-AI is a custom AI project developed by **Fabrizio**.

Permission from the author is required before copying, redistributing, or using substantial parts of this project.
