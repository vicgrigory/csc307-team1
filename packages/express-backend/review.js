import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
    mediaID: { // Composite Key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, "No valid media specified."]
    },
    userID: { // Composite Key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WebUser',
        required: [true, "No valid username specified."]
    },
    title: {
        type: String,
        required: [true, "Please add a title."]
    },
    content: {
        type: String,
        required: [true, "Please add content to your review."]
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: [true, "Please add a rating."]
    }
    }
);

ReviewSchema.index({ mediaID: 1, userID: 1 }, {unique: true});
// A user can only add 1 review to a file.

const Review = mongoose.model("Review", ReviewSchema, 'data');

export default Review;