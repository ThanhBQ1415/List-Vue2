import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  statusId: Number,
  name: String,
  displayOrder: Number,
  projectId: Number,
});

export const StatusModel = mongoose.model('Status', statusSchema); 