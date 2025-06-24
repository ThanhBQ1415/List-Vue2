import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: Number,
  fullName: String,
  email: String,
  password: String,
  avatarUrl: String,
  createdAt: Date,
});

export const UserModel = mongoose.model('User', userSchema); 