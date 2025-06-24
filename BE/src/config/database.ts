import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
  mongoose
    .connect(process.env.DB_URL!)
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error: unknown) => {
      console.log('Unable to connect to MongoDB Atlas!');
      console.error(error);
    });
}