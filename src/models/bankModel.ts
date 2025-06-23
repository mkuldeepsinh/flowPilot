import mongoose, { Document, Model } from 'mongoose';

export interface IBank extends Document {
  _id: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  accountType: 'saving' | 'current';
  currentAmount: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  updateAmount(amount: number): Promise<IBank>;
}

interface IBankModel extends Model<IBank> {
  findByCompanyId(companyId: string): Promise<IBank[]>;
  findByBankIdAndCompany(bankId: string, companyId: string): Promise<IBank | null>;
}

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    trim: true,
    uppercase: true
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true
  },
  accountType: {
    type: String,
    enum: ['saving', 'current'],
    required: [true, 'Account type is required']
  },
  currentAmount: {
    type: Number,
    required: [true, 'Current amount is required'],
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for efficient queries
bankSchema.index({ companyId: 1 });

// Static method to find banks by company ID
bankSchema.statics.findByCompanyId = function(companyId: string) {
  return this.find({ companyId }).sort({ createdAt: -1 });
};

// Static method to find bank by ID and company ID
bankSchema.statics.findByBankIdAndCompany = function(bankId: string, companyId: string) {
  return this.findOne({ _id: bankId, companyId });
};

// Method to update bank amount
bankSchema.methods.updateAmount = function(amount: number) {
  this.currentAmount = amount;
  return this.save();
};

const Bank = (mongoose.models.Bank as unknown as IBankModel) || mongoose.model<IBank, IBankModel>('Bank', bankSchema);

export default Bank; 