import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  hostId: mongoose.Types.ObjectId;
  hostName: string;
  participants: mongoose.Types.ObjectId[];
  maxParticipants: number;
  scheduledAt: Date;
  duration: number;
  type: 'group-meditation' | 'support-circle' | 'yoga' | 'breathwork' | 'discussion';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  language: string;
  tags: string[];
  isPublic: boolean;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 150
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  hostId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  hostName: { 
    type: String, 
    required: true 
  },
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  maxParticipants: { 
    type: Number, 
    default: 20,
    min: 2,
    max: 100
  },
  scheduledAt: { 
    type: Date, 
    required: true,
    index: true
  },
  duration: { 
    type: Number, 
    required: true,
    min: 15,
    max: 180
  },
  type: { 
    type: String,
    enum: ['group-meditation', 'support-circle', 'yoga', 'breathwork', 'discussion'],
    required: true
  },
  status: { 
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  language: { 
    type: String,
    default: 'English'
  },
  tags: [{ 
    type: String 
  }],
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  meetingLink: { 
    type: String,
    default: null
  }
}, {
  timestamps: true
});

sessionSchema.index({ status: 1, scheduledAt: 1 });
sessionSchema.index({ type: 1, status: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
