import { Streak } from '../models/Streak';
import mongoose from 'mongoose';

export class StreakService {
  async getOrCreateStreak(userId: string): Promise<any> {
    let streak = await Streak.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    if (!streak) {
      streak = await Streak.create({
        userId: new mongoose.Types.ObjectId(userId),
        currentStreak: 0,
        longestStreak: 0,
        dailyActivities: []
      });
    }

    return streak;
  }

  async recordMeditationActivity(userId: string, minutes: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Try to update existing entry for today
    const updateResult = await Streak.updateOne(
      { 
        userId: new mongoose.Types.ObjectId(userId),
        'dailyActivities.date': today 
      },
      {
        $inc: {
          totalMeditationMinutes: minutes,
          'dailyActivities.$.meditationMinutes': minutes
        }
      }
    );

    // 2. If no entry existed for today, push a new one
    if (updateResult.modifiedCount === 0) {
      await Streak.updateOne(
        { userId: new mongoose.Types.ObjectId(userId) },
        {
          $inc: { totalMeditationMinutes: minutes },
          $push: {
            dailyActivities: {
              date: today,
              meditationMinutes: minutes,
              assessmentsCompleted: 0,
              goalsCheckedIn: 0,
              sessionsAttended: 0,
              chatMessages: 0,
              gamesPlayed: 0
            }
          }
        }
      );
    }
    
    // 3. Update the streak logic too (since they were active)
    await this.updateStreak(userId);
  }

  async updateStreak(userId: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await Streak.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!streak) throw new Error('Streak not found');

    // Normalize lastActive to midnight for accurate day comparison
    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = lastActive ? Math.abs(today.getTime() - lastActive.getTime()) : null;
    const diffDays = diffTime !== null ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;

    // Logic Tree:
    // 1. If diff is 0: User already active today. Do nothing.
    // 2. If diff is 1: Consecutive day. Increment streak.
    // 3. If diff > 1 (or null): Streak broken (or new). Reset to 1.
    
    if (diffDays === 0) {
      // Already updated today, just return
      return streak;
    } else if (diffDays === 1) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }

    // Update longest streak if needed
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastActiveDate = today;
    return streak.save();
  }
}

export const streakService = new StreakService();