import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyActivity {
  date: Date;
  meditationMinutes: number;
  assessmentsCompleted: number;
  goalsCheckedIn: number;
  sessionsAttended: number;
  chatMessages: number;
  gamesPlayed: number;
}

export interface IStreak extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  totalMeditationMinutes: number;
  totalSessionsAttended: number;
  totalAssessmentsCompleted: number;
  totalGamesPlayed: number;
  lastActiveDate: Date;
  dailyActivities: IDailyActivity[];
  weeklyGoal: number;
  weeklyProgress: number;
  badges: string[];
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

const dailyActivitySchema = new Schema<IDailyActivity>({
  date: { type: Date, required: true },
  meditationMinutes: { type: Number, default: 0 },
  assessmentsCompleted: { type: Number, default: 0 },
  goalsCheckedIn: { type: Number, default: 0 },
  sessionsAttended: { type: Number, default: 0 },
  chatMessages: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 }
}, { _id: false });

const streakSchema = new Schema<IStreak>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true,
    index: true
  },
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  longestStreak: { 
    type: Number, 
    default: 0 
  },
  totalMeditationMinutes: { 
    type: Number, 
    default: 0 
  },
  totalSessionsAttended: { 
    type: Number, 
    default: 0 
  },
  totalAssessmentsCompleted: { 
    type: Number, 
    default: 0 
  },
  totalGamesPlayed: { 
    type: Number, 
    default: 0 
  },
  lastActiveDate: { 
    type: Date, 
    default: null 
  },
  dailyActivities: [dailyActivitySchema],
  weeklyGoal: { 
    type: Number, 
    default: 7 
  },
  weeklyProgress: { 
    type: Number, 
    default: 0 
  },
  badges: [{ 
    type: String 
  }],
  level: { 
    type: Number, 
    default: 1 
  },
  experience: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

streakSchema.index({ currentStreak: -1 });
streakSchema.index({ level: -1, experience: -1 });

export const Streak = mongoose.model<IStreak>('Streak', streakSchema);
