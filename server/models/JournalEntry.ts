import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  feeling: string;
  mood: string;
  notes: string;
  createdAt: Date;
}

const journalEntrySchema = new Schema<IJournalEntry>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  feeling: { 
    type: String, 
    required: true,
    trim: true
  },
  mood: { 
    type: String, 
    required: true,
    trim: true
  },
  notes: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);