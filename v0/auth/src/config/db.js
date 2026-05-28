import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.AUTH_DB_URL || 'mongodb://localhost:27017/auth');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;