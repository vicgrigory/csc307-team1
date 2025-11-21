import mongoose from "mongoose";

const WebUserSchema = new mongoose.Schema(
    { //_id is primary key
    username: {
        type: String,
        required: [true, "Enter a unique username."],
        unique: true,
        immutable: false // Change to true if we want to lock usernames
    },
    hashedPassword: {
        type: String,
        required: [true, "Password required."],
        immutable: true // Set to true until password reset is implemented
    },
    type: {
        type: String,
        enum: ['regular', 'moderator'],
        default: 'regular'
    },
    creation: { // Do not specify
        type: Date,
        default: Date.now(),
        immutable: true
    },
    about: {
        type: String,
        default: ""
    },
    profile: {
        type: String,
        default: ""
    },
    favorites: { // Do not specify
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'File',
        default: []
    }
    }
);

const WebUser = mongoose.model("WebUser", WebUserSchema, 'data');

export default WebUser;