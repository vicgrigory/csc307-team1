import reviewModel from "./review";
import fileFunctions from "./file-services";
import userFunctions from "./user-services";
import service from "./services";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI, {
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
        throw new Error("FID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!reviewTitle) {
        throw new Error("Title: invalid!");
    }
    if (!reviewContent) {
        throw new Error("Content: invalid!");
    }
    if (!(Number.isInteger(reviewRating)) || !(0<=reviewRating&&reviewRating<=5)) {
        throw new Error("Rating: invalid!");
    }
    const f = await fileFunctions.getFile(fileId);
    if (!f) {
        throw new Error("FID: 404!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    const dup = await reviewModel.findOne({mediaID: f._id, userID: u._id});
    if (dup) {
        throw new Error("Review: duplicate!");
    }
    try {
        return reviewModel.insertOne({
            mediaID: f._id,
            userID: u._id,
            title: reviewTitle,
            content: reviewContent,
            rating: reviewRating
        });
    } catch (error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Gets reviews for a file.
Returns a promise for a list of reviews (array of JSONs).
*/
async function getReviewsMedia(fileId) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    const f = await fileFunctions.getFile(fileId);
    if (!f) {
        throw new Error("FID: 404!");
    }
    try {
        return reviewModel.find({ mediaID: f._id });
    } catch (error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Gets reviews made by a user.
Returns a promise for a list of reviews (array of JSONs).
*/
async function getReviewsUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    try {
        return reviewModel.find({ userID: u._id });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Edits an existing review.
Returns a promise for that review (one JSON).
*/
async function editReview(desiredUsername, reviewId, reviewContent, reviewRating) {
    if (!reviewId) {
        throw new Error("RID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (reviewRating && (!(Number.isInteger(reviewRating)) || !(0<=reviewRating&&reviewRating<=5))) {
        throw new Error("Rating: invalid!");
    }
    let reviewIdObj;
    try {
        reviewIdObj = service.makeObjectId(reviewId);
    } catch(error) {
        throw new Error("RID: Not a string!");
    }
    const r = await reviewModel.findOne({ _id: reviewIdObj });
    if (!r) {
        throw new Error("RID: 404!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    if (!(r.userID.equals(u._id)) && (u.type != 'moderator')) {
        throw new Error("Username: unauthorized!");
    }
    if (!reviewContent) {
        reviewContent = r.content;
    }
    if (reviewRating === null || reviewRating === undefined) {
        reviewRating = r.rating; // Allows 0
    }
    try {
        return reviewModel.updateOne({ _id: r._id }, { content: reviewContent, rating: reviewRating });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Deletes a review.
Returns a promise for that review (one JSON).
*/
async function deleteReview(desiredUsername, reviewId) {
    if (!reviewId) {
        throw new Error("RID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    let reviewIdObj;
    try {
        reviewIdObj = service.makeObjectId(reviewId);
    } catch(error) {
        throw new Error("RID: Not a string!");
    }
    const r = await reviewModel.findOne({ _id: reviewIdObj });
    if (!r) {
        throw new Error("RID: 404!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    if (!(r.userID.equals(u._id)) && (u.type != 'moderator')) {
        throw new Error("Username: unauthorized!");
    }
    try {
        return reviewModel.deleteOne({ _id: r._id });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

export default {
    addReview, getReviewsMedia, getReviewsUser, editReview, deleteReview
};