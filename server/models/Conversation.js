import mongoose from 'mongoose';
import { MessageSchema } from './Message.js';

const ConversationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: 'New Conversation' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  messages: [MessageSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      // Convert models Map to plain object for easy frontend consumption
      if (ret.messages) {
        ret.messages.forEach(msg => {
          if (msg.models && msg.models instanceof Map) {
            msg.models = Object.fromEntries(msg.models);
          }
        });
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Conversation = mongoose.model('Conversation', ConversationSchema);
