// models/Company.js
import mongoose from 'mongoose';



const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  adminEmail: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
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


export default mongoose.models.Company || mongoose.model('Company', companySchema);