import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema({
  labelId: Number,
  name: String,
  color: String,
});

export const LabelModel = mongoose.model('Label', labelSchema); 