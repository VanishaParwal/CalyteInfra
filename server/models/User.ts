import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  city?: string;
  bio?: string;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  blockedUsers: mongoose.Types.ObjectId[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  avatar: { 
    type: String, 
    default: null
  },
  phone: { 
    type: String, 
    default: null
  },
  city: { 
    type: String, 
    default: null
  },
  bio: { 
    type: String, 
    maxlength: 500,
    default: null
  },
  voiceEnabled: { 
    type: Boolean, 
    default: true 
  },
  notificationsEnabled: { 
    type: Boolean, 
    default: true 
  },
  emergencyContacts: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  }],
  blockedUsers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  refreshToken: { 
    type: String, 
    default: null
  }
}, {
  timestamps: true
});

// FIX: Use async/await without 'next' parameter.
// This allows Mongoose to handle the promise automatically and avoids TypeScript type conflicts.
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// NOTE: Duplicate manual indexes removed. 
// Mongoose automatically creates indexes for fields marked with 'unique: true' in the schema.

export const User = mongoose.model<IUser>('User', userSchema);