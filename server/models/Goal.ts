import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetDays: number;
  currentProgress: number;
  isCompleted: boolean;
  category: 'meditation' | 'exercise' | 'sleep' | 'social' | 'mindfulness' | 'custom';
  priority: 'low' | 'medium' | 'high';
  reminderTime?: string;
  streakCount: number;
  lastCheckedIn?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  targetDays: { 
    type: Number, 
    required: true,
    min: 1,
    max: 365
  },
  currentProgress: { 
    type: Number, 
    default: 0,
    min: 0
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  category: { 
    type: String,
    enum: ['meditation', 'exercise', 'sleep', 'social', 'mindfulness', 'custom'],
    default: 'custom'
  },
  priority: { 
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reminderTime: { 
    type: String,
    default: null
  },
  streakCount: { 
    type: Number, 
    default: 0 
  },
  lastCheckedIn: { 
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

goalSchema.index({ userId: 1, isCompleted: 1 });
goalSchema.index({ userId: 1, category: 1 });

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);
