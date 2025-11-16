import mongoose from "mongoose";
import reviewModel from "./review.js";
import fileFunctions from "./file-services.js";
import userFunctions from "./user-services.js";

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/data", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

/*
Adds a review for a user under a media.
Returns a promise for that review (one JSON).
** reviewRating is an integer from 0 to 5. See review.js
*/
async function addReview(fileId, desiredUsername, reviewTitle, reviewContent, reviewRating) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!reviewTitle) {
        throw new Error("Review must contain a title!");
    }
    if (!reviewContent) {
        throw new Error("Review must contain content!");
    }
    if (!reviewRating || !(0<= reviewRating<= 5)) {
        throw new Error("Review must contain a rating from 0-5!");
    }
    const file = await fileFunctions.getFile(fileId);
    if (!file) {
        throw new Error("File ID does not correspond to a valid file!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to a valid user!");
    }
    try {
        return reviewModel.insertOne({
            mediaID: fileId,
            userID: user._id,
            title: reviewTitle,
            content: reviewContent,
            rating: reviewRating
        });
    } catch (error) {
        throw new Error("An error occured while creating your review!");
    }
}

/*
Gets reviews for a file.
Returns a promise for a list of reviews (array of JSONs).
*/
async function getReviewsMedia(fileId) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    const file = await fileFunctions.getFile(fileId);
    if (!file) {
        throw new Error("File ID does not correspond with a valid file!");
    }
    try {
        return reviewModel.find({ mediaID: fileId });
    } catch (error) {
        throw new Error("An error occured while getting reviews for your file!");
    }
}

/*
Gets reviews made by a user.
Returns a promise for a list of reviews (array of JSONs).
*/
async function getReviewsUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to a valid user!");
    }
    try {
        return reviewModel.find({ userID: user._id });
    } catch(error) {
        throw new Error("An error occured while getting reviews for this user!");
    }
}

/*
Edits an existing review.
Returns a promise for that review (one JSON).
*/
async function editReview(desiredUsername, reviewId, reviewContent, reviewRating) {
    if (!reviewId) {
        throw new Error("Invalid review ID!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const review = await reviewModel.findOne({ _id: reviewId });
    if (!review) {
        throw new Error("Review ID does not correspond to a valid review!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to a valid user!");
    }
    if (!(review.userID.equals(user._id)) && (user.type != 'moderator')) {
        throw new Error("Not authorized!");
    }
    if (!reviewContent) {
        reviewContent = review.content;
    }
    if (reviewRating === null || reviewRating === undefined) {
        reviewRating = review.rating;
    }
    try {
        return reviewModel.updateOne({ _id: reviewId }, { content: reviewContent, rating: reviewRating });
    } catch(error) {
        throw new Error("An error occured while updating your review!");
    }
}

/*
Deletes a review.
Returns a promise for that review (one JSON).
*/
async function deleteReview(desiredUsername, reviewId) {
    if (!reviewId) {
        throw new Error("Invalid review ID!");
    }
    const review = await reviewModel.findOne({ _id: reviewId });
    if (!review) {
        throw new Error("Review ID does not correspond to a valid review!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to a valid user!");
    }
    if (!(review.userID.equals(user._id)) && (user.type != 'moderator')) {
        throw new Error("Not authorized!");
    }
    try {
        return reviewModel.deleteOne({ _id: reviewId });
    } catch(error) {
        throw new Error("An error occured while trying to delete your review!");
    }
}

export default {
    addReview, getReviewsMedia, getReviewsUser, editReview, deleteReview
};