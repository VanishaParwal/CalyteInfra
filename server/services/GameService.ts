import { GameScore } from '../models/GameScore';
import { Streak } from '../models/Streak';
import mongoose from 'mongoose';

export class GameService {
  async saveGameScore(userId: string, data: any): Promise<any> {
    const score = await GameScore.create({
      userId: new mongoose.Types.ObjectId(userId),
      gameType: data.gameType,
      score: data.score,
      level: data.level || 1,
      timePlayed: data.timePlayed || 0,
      achievements: data.achievements || [],
    });

    await this.updateStreakActivity(userId, 'gamesPlayed');
    return score;
  }

  async getGameScores(userId: string, gameType?: string): Promise<any[]> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (gameType) query.gameType = gameType;
    return GameScore.find(query).sort({ score: -1 });
  }

  async getHighscores(gameType: string, limit = 10): Promise<any[]> {
    return GameScore.find({ gameType })
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username avatar');
  }

  private async updateStreakActivity(userId: string, field: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Streak.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $inc: { 
          totalGamesPlayed: 1,
          'dailyActivities.$[elem].gamesPlayed': 1
        }
      },
      {
        arrayFilters: [{ 'elem.date': today }],
        new: true,
      }
    );
  }
}

export const gameService = new GameService();
