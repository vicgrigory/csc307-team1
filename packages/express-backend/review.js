import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
    mediaID: { // Composite Key
        type: Schema.Types.ObjectID,
        ref: 'File',
        required: [true, "No valid media specified."]
    },
    userID: { // Composite Key
        type: Schema.Types.ObjectID,
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

const Review = mongoose.model("Review", ReviewSchema, 'data');

export default Review;