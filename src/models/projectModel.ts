import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  clientName: string;
  totalRevenue: number;
  cost: number;
  projectHead: mongoose.Schema.Types.ObjectId;
  employees: mongoose.Schema.Types.ObjectId[];
  tasks: mongoose.Schema.Types.ObjectId[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  company: mongoose.Schema.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date"],
    },
    clientName: {
      type: String,
      required: [true, "Please provide a client name"],
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    projectHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project; 