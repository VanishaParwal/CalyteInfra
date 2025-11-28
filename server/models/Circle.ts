import mongoose, { Document, Schema } from 'mongoose';

export interface ICircle extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'grief' | 'relationships' | 'self-care' | 'general';
  icon: string;
  creatorId: mongoose.Types.ObjectId;
  moderators: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  memberCount: number;
  isPrivate: boolean;
  rules: string[];
  language: string;
  city?: string;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const circleSchema = new Schema<ICircle>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  category: { 
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'grief', 'relationships', 'self-care', 'general'],
    required: true
  },
  icon: { 
    type: String,
    default: 'Heart'
  },
  creatorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  moderators: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  memberCount: { 
    type: Number, 
    default: 0 
  },
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  rules: [{ 
    type: String 
  }],
  language: { 
    type: String,
    default: 'English'
  },
  city: { 
    type: String,
    default: null
  },
  lastActivityAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

circleSchema.index({ category: 1, memberCount: -1 });
circleSchema.index({ isPrivate: 1, lastActivityAt: -1 });

export const Circle = mongoose.model<ICircle>('Circle', circleSchema);
