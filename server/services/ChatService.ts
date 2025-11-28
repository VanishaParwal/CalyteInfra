import { ChatMessage } from '../models/ChatMessage';
import mongoose from 'mongoose';

export class ChatService {
  async getConversation(userId: string, conversationId: string): Promise<any[]> {
    return ChatMessage.find({
      userId: new mongoose.Types.ObjectId(userId),
      conversationId,
    }).sort({ createdAt: 1 });
  }

  async createMessage(userId: string, data: any): Promise<any> {
    return ChatMessage.create({
      userId: new mongoose.Types.ObjectId(userId),
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      mode: data.mode || 'text',
    });
  }

  async getAllConversations(userId: string): Promise<any[]> {
    return ChatMessage.find({ userId: new mongoose.Types.ObjectId(userId) })
      .distinct('conversationId')
      .then((convIds) => convIds.map(id => ({ id })));
  }
}

export const chatService = new ChatService();
