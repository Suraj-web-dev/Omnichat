# 🚀 OmniChat • 3-Model AI Arena

A full-stack ChatGPT-style AI Playground built with **React**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB**. For every user prompt, it queries **3 AI Models** concurrently, allowing users to compare outputs side-by-side, inspect alternatives, and pick the winning response to advance the conversation thread.

---

## ✨ Features

- ⚡ **Multi-Model Parallel Generation**: Queries 3 AI models concurrently with real-time latency calculation and token usage estimation.
  - **Model 1**: Groq Qwen 3.8 / Llama *(Ultra-fast Free Tier)* or OpenAI GPT-4o
  - **Model 2**: Cohere Command R *(Free Tier)*
  - **Model 3**: Google Gemini 3.6 Flash *(100% Free Tier)*
- 🏆 **Interactive Winner Selection**: Pick the best response with 1-click celebration. The chosen answer becomes part of the conversation thread, while other model outputs remain inspectable in an expandable drawer.
- 🗂️ **Persistent Chat Sessions**: Full session management (create, search, rename, delete) persisted to **MongoDB** with automatic in-memory safety fallback.
- 🎨 **Modern Minimalist UI**: Sleek dark theme, syntax-highlighted code blocks with copy-to-clipboard, responsive 3-column grid & stacked views.
- 🛡️ **Zero-Crash Fallback**: Automatically simulates responses if any provider's API key is missing or rate-limited.

---

## 🏗️ Architecture

```
OmniChat/
├── server/                    # Node.js + Express Backend (MVC)
│   ├── config/
│   │   └── db.js              # MongoDB connection with safe fallback
│   ├── controllers/
│   │   ├── conversationController.js
│   │   └── messageController.js
│   ├── models/
│   │   ├── Conversation.js    # Mongoose Schema for chat sessions
│   │   └── Message.js         # Mongoose Schema for messages & 3 models
│   ├── routes/
│   │   ├── conversationRoutes.js
│   │   └── messageRoutes.js
│   ├── services/
│   │   └── aiService.js       # Parallel dispatcher (Groq, Cohere, Gemini, OpenAI)
│   └── index.js               # Server entry point
│
├── src/                       # React Frontend
│   ├── components/            # UI components (Header, Sidebar, Cards, Input)
│   ├── data/                  # Mock data & model metadata
│   ├── hooks/                 # useChat state management
│   ├── services/              # API fetch client
│   └── App.jsx
│
├── .env.example               # Environment variables template
└── package.json
```

---

## 🔑 Getting Free API Keys

1. **Google Gemini API** *(Free)*: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Cohere API** *(Free Tier)*: [Cohere Dashboard](https://dashboard.cohere.com/api-keys)
3. **Groq Cloud API** *(Free & Fast)*: [Groq Console](https://console.groq.com/keys)
4. **MongoDB**: Local `mongodb://localhost:27017/omnichat` or [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🚀 Quickstart Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Suraj-web-dev/Omnichat.git
cd Omnichat
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omnichat

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash

COHERE_API_KEY=your_cohere_api_key
COHERE_MODEL=command-r-08-2024

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=qwen/qwen3.8-27b
```

### 3. Run Application
Run both frontend and backend concurrently:
```bash
npm run dev:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📜 License
MIT

