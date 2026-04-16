# Sapflight-AI 🚀

## 📦 Project Overview

Sapflight-AI is a local AI chat focused on flight-related interactions.
It runs using **Node.js + Express** and connects to a **local LLM (like Llama via Ollama or LM Studio)** on the same network.

This allows the app to work **without paid APIs**, using your own computer as the AI server.

---

## 🧠 How It Works

* 📱 The client runs on Android (Termux + Acode)
* 🖥️ The AI model runs on your PC
* 🔌 The server connects to the model using a custom OpenAI-compatible API

---

## ⚙️ Requirements

Before running the project, install dependencies:

```bash
npm install
```

### 🔹 For Local AI (IMPORTANT)

You must have:

* Ollama or LM Studio running on your PC
* A model like `llama3`
* Your PC connected to the same Wi-Fi as your device

---

## ▶️ Run the Project

Start the server:

```bash
node server.js
```

Then open in your browser:

```
http://localhost:3000
```

---

## ⚡ Optional: Electron (Desktop Only)

This project includes Electron files for desktop builds.

To use it:

```bash
npm install --save-dev electron-builder
npm run build
npm run dist
```

📁 Output will be in the `dist/` folder

⚠️ Note: Electron is **not required** for Android usage.

---

## ⚠️ Notes

* Make sure your `baseURL` points to your PC IP
* Example:

```
http://192.168.x.x:11434/v1
```

* Both devices must be on the same network

---

## 💡 Tips

If something fails:

```bash
npm install
```

Restart your server and check your model is running.

---

## 📄 License

This project is private. Permission is required to use or distribute.
