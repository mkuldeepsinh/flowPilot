import mongoose, { Document, Model } from 'mongoose';

export interface ICompany extends Document {
  _id: string;
  companyName: string;
  companyId: string;
  adminEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    unique: true
  },
  adminEmail: {
    type: String,
    required: [true, 'Admin email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Static method to find company by ID
companySchema.statics.findByCompanyId = function(companyId: string) {
  return this.findOne({ companyId, isActive: true });
};

// Static method to find company by name
companySchema.statics.findByCompanyName = function(companyName: string) {
  return this.findOne({ 
    companyName: { $regex: new RegExp(companyName, 'i') },
    isActive: true 
  });
};

const Company = (mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema)) as Model<ICompany>;

export default Company; 