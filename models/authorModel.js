import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: true
    },
    email: {
        type: String,
        unique: [true , 'This is already exist'],
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Author = mongoose.model('Author', authorSchema); // Create the model

export default Author; // Export the model, not a string
