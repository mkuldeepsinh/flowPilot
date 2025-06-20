import mongoose, { Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name?: string;
  role: 'admin' | 'employee' | 'owner';
  companyId: string;
  companyName: string;
  isActive: boolean;
  emailVerified?: Date;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isApproved: boolean;
  isRejected: boolean;
  approvedBy?: string | null;
  rejectedBy?: string | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'owner'],
    required: [true, 'Role is required']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    ref: 'Company'
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isRejected: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: String,
    default: null
  },
  rejectedBy: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function(): Promise<Document> {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email, isActive: true });
};

const User = (mongoose.models.User || mongoose.model<IUser>('User', userSchema)) as Model<IUser>;

export default User;