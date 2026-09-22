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

export const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  conversationId: { type: String, required: false, index: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String }, // For user messages
  timestamp: { type: String, default: () => new Date().toISOString() },
  selectedModelId: { type: String, default: null }, // Chosen winner model
  models: {
    type: Map,
    of: ModelResponseSchema,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      if (ret.models && ret.models instanceof Map) {
        ret.models = Object.fromEntries(ret.models);
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Message = mongoose.model('Message', MessageSchema);

