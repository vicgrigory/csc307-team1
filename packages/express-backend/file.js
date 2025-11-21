import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    { // _id is primary key
    title: {
        type: String,
        required: [true, "File requires a title."]
    },
    link: {
        type: String,
        required: [true, "No link to file specified."]
    },
    filetype: {
        type: String,
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
        required: [true, "A valid user ID was not given."],
        immutable: true
    },
    upload: { // Do not specify
        type: Date,
        default: Date.now(),
        immutable: true
    },
    tags: {
        type: [String],
        default: []
    }
    }
);

const File = mongoose.model("File", FileSchema);

export default File;