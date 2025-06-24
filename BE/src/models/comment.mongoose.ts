import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commentId: Number,
  content: String,
  createdAt: Date,
  userId: Number,
  taskId: Number,
});

export const CommentModel = mongoose.model('Comment', commentSchema); 