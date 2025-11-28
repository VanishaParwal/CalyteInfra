import { Goal, IGoal } from '../models/Goal';
import { Streak } from '../models/Streak';
import mongoose from 'mongoose';

export class GoalService {
  async getGoalsByUser(userId: string): Promise<IGoal[]> {
    return Goal.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async createGoal(userId: string, data: any): Promise<IGoal> {
    const goal = await Goal.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...data,
    });
    // FIX: Cast to unknown first, then IGoal to handle Mongoose's complex return type
    return goal as unknown as IGoal;
  }

  async updateGoal(goalId: string, data: any): Promise<IGoal | null> {
    return Goal.findByIdAndUpdate(goalId, data, { new: true });
  }

  async deleteGoal(goalId: string): Promise<IGoal | null> {
    return Goal.findByIdAndDelete(goalId);
  }

  async checkInGoal(goalId: string, userId: string): Promise<IGoal | null> {
    const goal = await Goal.findById(goalId);
    
    // Ensure goal exists and belongs to the user
    if (!goal || goal.userId.toString() !== userId) {
      throw new Error('Goal not found');
    }

    const today = new Date();
    const lastCheckin = goal.lastCheckedIn ? new Date(goal.lastCheckedIn) : null;
    
    // Check if checkin is within ~24 hours (consecutive)
    // 86400000 ms = 24 hours. We add a small buffer (1000ms).
    const isConsecutiveDay = lastCheckin && 
      (today.getTime() - new Date(lastCheckin).getTime()) < (24 * 60 * 60 * 1000 + 1000);

    // Logic: If it's a new checkin (never checked in) or strictly consecutive, we handle streak
    // Note: You might want to reset streakCount to 1 if !isConsecutiveDay && lastCheckin (streak broken)
    let streakIncrement = 0;
    
    // Logic from your snippet:
    if (!lastCheckin || !isConsecutiveDay) {
       // Reset or Start streak logic might go here
       // For now, keeping your snippet's flow:
       streakIncrement = 1;
    } else if (isConsecutiveDay) {
       // If strictly consecutive, typically we increment streak too
       streakIncrement = 1;
    }

    // Cap progress at targetDays
    goal.currentProgress = Math.min(goal.currentProgress + 1, goal.targetDays);
    goal.streakCount += streakIncrement;
    goal.lastCheckedIn = today;
    
    if (goal.currentProgress >= goal.targetDays) {
      goal.isCompleted = true;
    }

    return goal.save();
  }
}

export const goalService = new GoalService();