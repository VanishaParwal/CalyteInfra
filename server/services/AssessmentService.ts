import { Assessment } from '../models/Assessment';
import mongoose from 'mongoose';

export class AssessmentService {
  async createAssessment(userId: string, data: any): Promise<any> {
    const score = this.calculateScore(data.responses);
    const category = this.categorizeScore(score);

    return Assessment.create({
      userId: new mongoose.Types.ObjectId(userId),
      score,
      category,
      responses: data.responses,
      completedAt: new Date(),
    });
  }

  async getUserAssessments(userId: string): Promise<any[]> {
    return Assessment.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async getLatestAssessment(userId: string): Promise<any> {
    return Assessment.findOne({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  private calculateScore(responses: any[]): number {
    if (!responses || responses.length === 0) return 0;
    const sum = responses.reduce((acc, resp) => acc + (resp.answer || 0), 0);
    const maxScore = responses.length * 4;
    return Math.round((sum / maxScore) * 100);
  }

  private categorizeScore(score: number): 'low' | 'moderate' | 'high' | 'severe' {
    if (score < 25) return 'low';
    if (score < 50) return 'moderate';
    if (score < 75) return 'high';
    return 'severe';
  }
}

export const assessmentService = new AssessmentService();
