import { z } from "zod";

// =========================================
// 1. USERS
// =========================================
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars").max(30),
  password: z.string().min(8, "Password must be at least 8 chars"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  phone?: string | null;
  city?: string | null;
  bio?: string | null;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  emergencyContacts: { name: string; phone: string; relationship: string }[];
  blockedUsers: string[];
  createdAt: Date | string;
};

// =========================================
// 2. TRACKS (Music/Audio)
// =========================================
export const insertTrackSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().default('Calyte Sounds'),
  duration: z.number().min(0),
  category: z.enum(['healing-frequencies', 'binaural-beats', 'nature-sounds', 'ambient', 'meditation', 'sleep']),
  audioUrl: z.string().url(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  frequency: z.string().optional(),
});

export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Track = {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  frequency?: string;
  category: string;
  audioUrl: string;
  coverImage?: string;
  playCount: number;
  likedBy: string[];
  tags: string[];
  isActive: boolean;
};

// =========================================
// 3. STREAKS & ACTIVITY
// =========================================
export type DailyActivity = {
  date: Date | string;
  meditationMinutes: number;
  assessmentsCompleted: number;
  goalsCheckedIn: number;
  sessionsAttended: number;
  chatMessages: number;
  gamesPlayed: number;
};

export type Streak = {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalMeditationMinutes: number;
  dailyActivities: DailyActivity[];
  weeklyGoal: number;
  weeklyProgress: number;
  badges: string[];
  level: number;
  experience: number;
};

// =========================================
// 4. SESSIONS (Live Events)
// =========================================
export const insertSessionSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  scheduledAt: z.coerce.date(),
  duration: z.number().min(15).max(180),
  type: z.enum(['group-meditation', 'support-circle', 'yoga', 'breathwork', 'discussion']),
  maxParticipants: z.number().min(2).max(100).default(20),
  language: z.string().default('English'),
  isPublic: z.boolean().default(true),
});

export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Session = {
  _id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  participants: string[];
  maxParticipants: number;
  scheduledAt: Date | string;
  duration: number;
  type: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingLink?: string;
};

// =========================================
// 5. GOALS
// =========================================
export const insertGoalSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  targetDays: z.number().min(1).max(365),
  category: z.enum(['meditation', 'exercise', 'sleep', 'social', 'mindfulness', 'custom']).default('custom'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  reminderTime: z.string().optional(),
});

export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Goal = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  targetDays: number;
  currentProgress: number;
  isCompleted: boolean;
  category: string;
  priority: string;
  streakCount: number;
};

// =========================================
// 6. GAME SCORES
// =========================================
export const insertGameScoreSchema = z.object({
  gameType: z.enum(['zen-garden', 'color-flow', 'mindful-maze', 'pattern-peace', 'calm-tetris']),
  score: z.number().min(0),
  level: z.number().default(1),
  timePlayed: z.number().min(0),
});

export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;

export type GameScore = {
  _id: string;
  userId: string;
  gameType: string;
  score: number;
  level?: number;
  timePlayed: number;
  createdAt: Date | string;
};

// =========================================
// 7. CIRCLES
// =========================================
export const insertCircleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  category: z.enum(['anxiety', 'depression', 'stress', 'grief', 'relationships', 'self-care', 'general']),
  isPrivate: z.boolean().default(false),
  language: z.string().default('English'),
  city: z.string().optional(),
});

export type InsertCircle = z.infer<typeof insertCircleSchema>;

export type Circle = {
  _id: string;
  name: string;
  description: string;
  category: string;
  creatorId: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivityAt: Date | string;
};

export type CircleMember = {
  _id: string;
  circleId: string;
  userId: string;
  joinedAt: Date | string;
};

// =========================================
// 8. CHAT MESSAGES
// =========================================
export const insertChatMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string().max(10000),
  mode: z.enum(['text', 'speech']).default('text'),
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ChatMessage = {
  _id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  isRead: boolean;
  createdAt: Date | string;
};

// =========================================
// 9. ASSESSMENTS
// =========================================
export const insertAssessmentSchema = z.object({
  score: z.number().min(0).max(100),
  category: z.enum(['low', 'moderate', 'high', 'severe']),
  responses: z.array(z.object({
    questionIndex: z.number(),
    answer: z.number().min(0).max(4)
  })),
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Assessment = {
  _id: string;
  userId: string;
  score: number;
  category: string;
  completedAt: Date | string;
};

// =========================================
// 10. JOURNAL (Missing in your snippet but needed for Routes)
// =========================================
export const insertJournalSchema = z.object({
  feeling: z.string().min(1).max(100),
  mood: z.string().min(1).max(50), 
  notes: z.string().min(1).max(2000),
});

export type InsertJournalEntry = z.infer<typeof insertJournalSchema>;

export type JournalEntry = {
  _id: string;
  userId: string;
  feeling: string;
  mood: string;
  notes: string;
  createdAt: Date | string;
};

// =========================================
// 11. DISCUSSIONS (Needed for Routes)
// =========================================
export const insertDiscussionSchema = z.object({
  message: z.string().min(1).max(1000),
});

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type CircleDiscussion = {
  _id: string;
  circleId: string;
  userId: string;
  message: string;
  likes: number;
  createdAt: Date | string;
};