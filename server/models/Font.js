import mongoose from 'mongoose';

const FontSchema = new mongoose.Schema({
    fontName: { type: String, required: true },
    fontLower: String,
    fontUpper: String,
    fontDigits: String
});

export default mongoose.model('Font', FontSchema);
