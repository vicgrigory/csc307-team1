import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema(
    {
    fileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, "No valid file specified."],
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WebUser',
        required: [true, "No valid user specified."]
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion',
        default: null
    },
    content: {
        type: String,
        required: [true, "Discussion content is required."],
        maxlength: [2000, "Content cannot exceed 2000 characters."]
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'WebUser',
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    }
);

DiscussionSchema.index({ fileID: 1, createdAt: -1 });
DiscussionSchema.index({ parentID: 1 });

const Discussion = mongoose.model("Discussion", DiscussionSchema);

export default Discussion;
