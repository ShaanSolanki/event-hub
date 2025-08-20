import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './src/routes/user-route.js';
import eventRoute from './src/routes/event-route.js';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

app.use(cors());
app.use(express.json());

// Serve uploads folder for images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
