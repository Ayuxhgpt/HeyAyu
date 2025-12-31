import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Font from './models/Font.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Serverless Optimized)
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fancyfont', {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
        });
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error: Server will continue without DB.');
        // We do NOT set isConnected to true, so middleware will try again or fail gracefully
    }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.get('/api/fonts', async (req, res) => {
    try {
        const fonts = await Font.find();
        res.json(fonts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
