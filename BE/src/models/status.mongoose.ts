import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  statusId: Number,
  name: String,
});

export const StatusModel = mongoose.model('Status', statusSchema); 