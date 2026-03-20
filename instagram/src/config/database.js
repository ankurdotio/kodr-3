import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {
  try {
    const MONGODB_URI = config.MONGODB_URI || 'mongodb://localhost:27017/instagram';

    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
