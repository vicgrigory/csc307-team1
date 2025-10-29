import mongoose from "mongoose";

const WebUserSchema = new mongoose.Schema(
    { //_id is primary key
    username: {
        type: String,
        required: [true, "Enter a unique username."],
        unique: true,
        immutable: true // Change to false if we want to change usernames
    },
    creation: { // Do not specify
        type: Date,
        default: Date.now(),
        immutable: true
    },
    about: {
        type: String
    },
    profile: {
        type: String
    },
    favorites: {
        type: [Schema.Types.ObjectID],
        ref: 'File',
        default: []
    }
    }
);

const WebUser = mongoose.model("WebUser", WebUserSchema, 'data');

export default WebUser;