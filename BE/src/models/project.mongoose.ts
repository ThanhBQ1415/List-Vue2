import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  ownerId: Number,
  createdAt: Date,
  statusId: Number,
});

export const ProjectModel = mongoose.model('Project', projectSchema); 