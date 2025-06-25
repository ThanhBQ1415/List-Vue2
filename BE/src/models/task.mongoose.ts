import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: Number,
  title: String,
  description: String,
  startDate: Date,
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date,
  creatorId: Number,
  assigneeId: Number,
  statusId: Number,
  labelId: [Number],
  projectId: Number,
});

export const TaskModel = mongoose.model('Task', taskSchema); 