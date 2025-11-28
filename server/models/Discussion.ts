import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  _id: mongoose.Types.ObjectId;
  circleId: string; // Keeping as string to match schema, or ObjectId if you prefer strict linking
  userId: string;
  message: string;
  likes: number;
  createdAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  circleId: { 
    type: String, 
    required: true,
    index: true
  },
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  message: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema);