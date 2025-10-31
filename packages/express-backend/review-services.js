import mongoose from "mongoose";
import reviewModel from "./review.js";

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((error) => console.log(error));

function addReview(review) {
    const reviewToAdd = new reviewModel(review);
    const promise = reviewToAdd.save();
    return promise;
}

//need appropriate perms
function editReview(reviewID, title, content, rating) { //this is assuming it autofills and we can update everything. can write separate functions if needed
    base = reviewModel.findOne({ _id: reviewID })
    if (title) {
        base = base.updateOne({ title: title });
    }
    if (content) {
        base = base.updateOne({ content: content });
    }
    if (rating) {
        base = base.updateOne({ rating: rating });
    }
    return base;
}

function deleteReview(reviewID) {
    return reviewModel.findByIdAndDelete(reviewID);
}

export default {
    addReview, editReview, deleteReview
};