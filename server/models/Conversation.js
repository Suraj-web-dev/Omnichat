import mongoose from 'mongoose';

const ModelResponseSchema = new mongoose.Schema({
  modelId: { type: String, required: true },
  modelName: { type: String, required: true },
  content: { type: String, default: '' },
  latency: { type: String, default: '...' },
  tokens: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null }
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String }, // For user messages
  timestamp: { type: String, default: () => new Date().toISOString() },
  selectedModelId: { type: String, default: null }, // Winner model chosen by user
  models: {
    type: Map,
    of: ModelResponseSchema,
    default: {}
  }
}, { _id: false });

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

