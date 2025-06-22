import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface ITask extends Document {
  name: string;
  description: string;
  project: mongoose.Schema.Types.ObjectId;
  assignedTo: mongoose.Schema.Types.ObjectId;
  status: TaskStatus;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: [true, "Please provide a task name"],
      trim: true,
    },
    description: {
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    completionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task; 