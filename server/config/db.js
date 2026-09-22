import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnichat';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    console.log(`[MongoDB] ✅ Connected to ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.log(`[MongoDB] ℹ️ MongoDB is offline (${error.message}). Running in In-Memory Fallback Mode.`);
    return false;
  }
}

