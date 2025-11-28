import mongoose, { Document, Schema } from 'mongoose';

export interface IGameScore extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  gameType: 'zen-garden' | 'color-flow' | 'mindful-maze' | 'pattern-peace' | 'calm-tetris';
  score: number;
  level?: number;
  timePlayed: number;
  completedAt: Date;
  achievements?: string[];
  createdAt: Date;
}

const gameScoreSchema = new Schema<IGameScore>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  gameType: { 
    type: String,
    enum: ['zen-garden', 'color-flow', 'mindful-maze', 'pattern-peace', 'calm-tetris'],
    required: true
  },
  score: { 
    type: Number, 
    required: true,
    min: 0
  },
  level: { 
    type: Number,
    default: 1
  },
  timePlayed: { 
    type: Number, 
    required: true,
    min: 0
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  },
  achievements: [{ 
    type: String 
  }]
}, {
  timestamps: true
});

gameScoreSchema.index({ userId: 1, gameType: 1 });
gameScoreSchema.index({ gameType: 1, score: -1 });
gameScoreSchema.index({ userId: 1, createdAt: -1 });

export const GameScore = mongoose.model<IGameScore>('GameScore', gameScoreSchema);
