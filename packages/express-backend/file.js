import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    { // _id is primary key
    title: {
        type: String,
        required: [true, "File requires a title."]
    },
    filetype: {
        type: String, enum: ["mp3", "pdf"],
        required: [true, "File requires a valid filetype."]
    },
    creator: {
        type: String
    },
    creationDate: {
        type: Date
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WebUser',
        required: [true, "A valid username was not given."],
        immutable: true
    },
    upload: { // Do not specify
        type: Date,
        default: Date.now(),
        immutable: true
    }
    }
);

const File = mongoose.model("File", FileSchema, 'data');

export default File;