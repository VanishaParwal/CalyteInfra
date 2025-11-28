import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentResponse {
  questionIndex: number;
  answer: number;
}

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: number;
  category: 'low' | 'moderate' | 'high' | 'severe';
  responses: IAssessmentResponse[];
  completedAt: Date;
  createdAt: Date;
}

const assessmentSchema = new Schema<IAssessment>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  score: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  category: { 
    type: String, 
    enum: ['low', 'moderate', 'high', 'severe'],
    required: true
  },
  responses: [{
    questionIndex: { type: Number, required: true },
    answer: { type: Number, required: true, min: 0, max: 4 }
  }],
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

assessmentSchema.index({ userId: 1, createdAt: -1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
