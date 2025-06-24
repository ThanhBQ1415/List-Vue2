import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  itemId: Number,
  title: String,
  isCompleted: Boolean,
  taskId: Number,
});

export const ChecklistItemModel = mongoose.model('ChecklistItem', checklistItemSchema); 