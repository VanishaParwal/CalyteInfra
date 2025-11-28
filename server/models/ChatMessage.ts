import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  mode: 'text' | 'speech';
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
  isRead: boolean;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  conversationId: { 
    type: String, 
    required: true,
    index: true
  },
  role: { 
    type: String, 
    enum: ['user', 'assistant'],
    required: true
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 10000
  },
  mode: { 
    type: String, 
    enum: ['text', 'speech'],
    default: 'text'
  },
  sentiment: { 
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: null
  },
  topics: [{ 
    type: String 
  }],
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

chatMessageSchema.index({ userId: 1, conversationId: 1, createdAt: -1 });
chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
