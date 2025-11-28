import { 
  type User, type InsertUser, 
  type Circle, type InsertCircle,
  type JournalEntry, type InsertJournalEntry,
  type Track, type InsertTrack,
  type Goal, type InsertGoal,
  type GameScore, type InsertGameScore,
  type Session, type InsertSession,
  type Assessment, type InsertAssessment,
  type CircleDiscussion, type InsertDiscussion, // Added types
  type Streak
} from "@shared/schema";

// Import All Mongoose Models
import { User as UserModel } from "./models/User";
import { Circle as CircleModel } from "./models/Circle";
import { Track as TrackModel } from "./models/Track";
import { Goal as GoalModel } from "./models/Goal";
import { GameScore as GameScoreModel } from "./models/GameScore";
import { Session as SessionModel } from "./models/Session";
import { JournalEntry as JournalModel } from "./models/JournalEntry";
import { Assessment as AssessmentModel } from "./models/Assessment";
import { Streak as StreakModel } from "./models/Streak";
import { Discussion as DiscussionModel } from "./models/Discussion"; // Added Model

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tracks
  getAllTracks(category?: string): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;

  // Goals
  getUserGoals(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;

  // Games & Streaks
  saveGameScore(userId: string, score: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: string): Promise<GameScore[]>;
  getUserStreak(userId: string): Promise<Streak | undefined>;

  // Sessions
  getAllSessions(): Promise<Session[]>;
  createSession(session: InsertSession & { hostId: string, hostName: string }): Promise<Session>;

  // Circles
  createCircle(circle: InsertCircle & { createdBy: string }): Promise<Circle>;
  getAllCircles(): Promise<Circle[]>;
  joinCircle(circleId: string, userId: string): Promise<boolean>;

  // Circle Discussions (NEW)
  createDiscussion(circleId: string, userId: string, discussion: InsertDiscussion): Promise<CircleDiscussion>;
  getCircleDiscussions(circleId: string): Promise<CircleDiscussion[]>;

  // Journal
  createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  getUserJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;

  // Assessments
  createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
}

export class MongoStorage implements IStorage {
  
  // ===== Users =====
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    return user ? (user as unknown as User) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user ? (user as unknown as User) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser as any);
    return (user as any).toObject() as unknown as User;
  }

  // ===== Tracks =====
  async getAllTracks(category?: string): Promise<Track[]> {
    const query = category ? { category } : {};
    const tracks = await TrackModel.find(query).sort({ title: 1 }).lean();
    return tracks.map(t => t as unknown as Track);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const track = await TrackModel.create(insertTrack as any);
    return (track as any).toObject() as unknown as Track;
  }

  // ===== Goals =====
  async getUserGoals(userId: string): Promise<Goal[]> {
    const goals = await GoalModel.find({ userId }).lean();
    return goals.map(g => g as unknown as Goal);
  }

  async createGoal(userId: string, goal: InsertGoal): Promise<Goal> {
    const newGoal = await GoalModel.create({ ...goal, userId } as any);
    return (newGoal as any).toObject() as unknown as Goal;
  }

  // ===== Games & Streaks =====
  async saveGameScore(userId: string, score: InsertGameScore): Promise<GameScore> {
    const newScore = await GameScoreModel.create({ ...score, userId } as any);
    return (newScore as any).toObject() as unknown as GameScore;
  }

  async getUserGameScores(userId: string): Promise<GameScore[]> {
    const scores = await GameScoreModel.find({ userId }).sort({ score: -1 }).lean();
    return scores.map(s => s as unknown as GameScore);
  }

  async getUserStreak(userId: string): Promise<Streak | undefined> {
    const streak = await StreakModel.findOne({ userId }).lean();
    return streak ? (streak as unknown as Streak) : undefined;
  }

  // ===== Sessions =====
  async getAllSessions(): Promise<Session[]> {
    const sessions = await SessionModel.find({ status: { $ne: 'cancelled' } }).sort({ scheduledAt: 1 }).lean();
    return sessions.map(s => s as unknown as Session);
  }

  async createSession(session: InsertSession & { hostId: string, hostName: string }): Promise<Session> {
    const newSession = await SessionModel.create(session as any);
    return (newSession as any).toObject() as unknown as Session;
  }

  // ===== Circles =====
  async createCircle(circle: InsertCircle & { createdBy: string }): Promise<Circle> {
    const newCircle = await CircleModel.create({
      ...circle,
      creatorId: circle.createdBy,
      memberCount: 1,
      members: [circle.createdBy]
    } as any);
    
    return (newCircle as any).toObject() as unknown as Circle;
  }

  async getAllCircles(): Promise<Circle[]> {
    const circles = await CircleModel.find().sort({ createdAt: -1 }).lean();
    return circles.map(c => c as unknown as Circle);
  }

  async joinCircle(circleId: string, userId: string): Promise<boolean> {
    await CircleModel.findByIdAndUpdate(circleId, {
      $addToSet: { members: userId },
      $inc: { memberCount: 1 }
    });
    return true;
  }

  // ===== Circle Discussions (NEW) =====
  async createDiscussion(circleId: string, userId: string, discussion: InsertDiscussion): Promise<CircleDiscussion> {
    const newDiscussion = await DiscussionModel.create({
      ...discussion,
      circleId,
      userId
    } as any);
    return (newDiscussion as any).toObject() as unknown as CircleDiscussion;
  }

  async getCircleDiscussions(circleId: string): Promise<CircleDiscussion[]> {
    const discussions = await DiscussionModel.find({ circleId }).sort({ createdAt: -1 }).lean();
    return discussions.map(d => d as unknown as CircleDiscussion);
  }

  // ===== Journal Entries =====
  async createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    const newEntry = await JournalModel.create({ ...entry, userId } as any);
    return (newEntry as any).toObject() as unknown as JournalEntry;
  }

  async getUserJournalEntries(userId: string, limit: number = 10): Promise<JournalEntry[]> {
    const entries = await JournalModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
    return entries.map(e => e as unknown as JournalEntry);
  }

  // ===== Assessments =====
  async createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment> {
    const newAssessment = await AssessmentModel.create({ ...assessment, userId } as any);
    return (newAssessment as any).toObject() as unknown as Assessment;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    const assessments = await AssessmentModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return assessments.map(a => a as unknown as Assessment);
  }
}

export const storage = new MongoStorage();