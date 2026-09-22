import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health Check & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    keysConfigured: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      cohere: Boolean(process.env.COHERE_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
    },
    database: {
      connected: req.app.locals.dbConnected || false,
      mode: req.app.locals.dbConnected ? 'MongoDB Live' : 'In-Memory Fallback'
    }
  });
});

// Mount Routes (MVC)
app.use('/api/conversations', conversationRoutes);
app.use('/api/conversations', messageRoutes);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 [OmniChat Backend] Server is running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Free & Frontier AI Provider Keys Status:`);
  console.log(`   - Google Gemini (Free):   ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️ Missing (Get free key from aistudio.google.com)'}`);
  console.log(`   - Cohere (Free Tier):     ${process.env.COHERE_API_KEY ? '✅ Configured' : '⚠️ Missing (Get free key from dashboard.cohere.com)'}`);
  console.log(`   - Groq / Llama (Free):    ${process.env.GROQ_API_KEY ? '✅ Configured' : '⚠️ Missing (Get free key from console.groq.com)'}`);
  console.log(`   - OpenAI (Optional):      ${process.env.OPENAI_API_KEY ? '✅ Configured' : '⚠️ Optional'}`);

  // Connect to MongoDB in the background
  connectDB().then(connected => {
    app.locals.dbConnected = connected;
    console.log(`   - Database Mode:          ${connected ? '✅ MongoDB Live' : '⚠️ In-Memory Fallback (Active)'}\n`);
  });
});
