import mongoose, { Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  artist: string;
  duration: number;
  frequency?: string;
  category: 'healing-frequencies' | 'binaural-beats' | 'nature-sounds' | 'ambient' | 'meditation' | 'sleep';
  audioUrl: string;
  coverImage?: string;
  playCount: number;
  likedBy: mongoose.Types.ObjectId[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const trackSchema = new Schema<ITrack>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  artist: { 
    type: String,
    trim: true,
    default: 'Calyte Sounds'
  },
  duration: { 
    type: Number, 
    required: true,
    min: 0
  },
  frequency: { 
    type: String,
    default: null
  },
  category: { 
    type: String,
    enum: ['healing-frequencies', 'binaural-beats', 'nature-sounds', 'ambient', 'meditation', 'sleep'],
    required: true
  },
  audioUrl: { 
    type: String, 
    required: true 
  },
  coverImage: { 
    type: String,
    default: null
  },
  playCount: { 
    type: Number, 
    default: 0 
  },
  likedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  tags: [{ 
    type: String 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

trackSchema.index({ category: 1, playCount: -1 });
trackSchema.index({ isActive: 1 });

export const Track = mongoose.model<ITrack>('Track', trackSchema);
