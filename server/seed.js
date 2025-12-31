import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Font from './models/Font.js';
import { FONT_DATA } from './data/fonts.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fancyfont')
    .then(async () => {
        console.log('MongoDB Connected for Seeding');

        try {
            await Font.deleteMany({});
            console.log('Cleared existing fonts');

            await Font.insertMany(FONT_DATA);
            console.log(`Seeded ${FONT_DATA.length} fonts`);
        } catch (e) {
            console.error("Seeding Error:", e);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error("Connection Error:", err);
        process.exit(1);
    });
