import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password -refreshToken');
  }

  async updateUserProfile(userId: string, data: any): Promise<IUser | null> {
    const allowedFields = ['fullName', 'avatar', 'phone', 'city', 'bio', 'voiceEnabled', 'notificationsEnabled'];
    const updateData: any = {};
    
    allowedFields.forEach(field => {
      if (field in data) {
        updateData[field] = data[field];
      }
    });

    return User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken');
  }

  async addEmergencyContact(userId: string, contact: any): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $push: { emergencyContacts: contact } },
      { new: true }
    ).select('-password -refreshToken');
  }

  async deleteEmergencyContact(userId: string, contactId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { emergencyContacts: { _id: contactId } } },
      { new: true }
    ).select('-password -refreshToken');
  }

  async blockUser(userId: string, blockUserId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $addToSet: { blockedUsers: new mongoose.Types.ObjectId(blockUserId) } },
      { new: true }
    ).select('-password -refreshToken');
  }

  async unblockUser(userId: string, blockUserId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { blockedUsers: new mongoose.Types.ObjectId(blockUserId) } },
      { new: true }
    ).select('-password -refreshToken');
  }
}

export const userService = new UserService();
