import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from "./user.js";

dotenv.config();
mongoose.set("debug", true);

//process.env.MONGODB_URI <- use this in production
await mongoose.connect("mongodb://localhost:27017/data", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

/*
Creates a new user in the database with a desired username, setting the about and profile to empty strings and sets the user as a non moderator.
desiredUsername: String. Currently no limit as to what it can be, can add that in if needed.
*/
async function createUser(desiredUsername) { // if we add a password, it should be hashed by this point
    if (!desiredUsername) {
        throw new Error("Username cannot be empty!");
    }
    if (!(await userModel.findOne({ username: desiredUsername }))) {
        //console.log(`success, ${desiredUsername}`);
        return userModel.insertOne({ username: desiredUsername });
    };
    //console.log(`fail, ${desiredUsername}`);
    throw new Error(`The username ${desiredUsername} is taken!`);
}

/*
Sets an existing user as a moderator. Checks for a valid username and that the user is not already a moderator before performing the action.
desiredUsername: String. Function will return an error if it cannot find that user in the database, or if that user is already a moderator. Can set this to _id if needed.
*/
async function setAsModerator(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("User could not be found!");
    }
    console.log(user);
    console.log(`username: ${desiredUsername}, status: ${user.type}, mod?: ${user.type == "moderator"}`);
    if (user.type == "regular") {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'moderator' });
    };
    throw new Error("User is already a moderator!");
}

/*
Sets an existing user as a regular user. Checks for a valid username and that the user is a moderator before performing the action.
desiredUsername: String. Function will return an error if it cannot find that user in the database, or if that user is already not a moderator. Can set this to _id if needed.
*/
async function setAsRegular(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("User could not be found!");
    }
    if (user.type == "moderator") {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'regular' });
    };
    throw new Error("User is not a moderator!");
}

/*
Edits user credentials by replacing the current ones with what is entered. Checks for a valid id, since the username is able to be changed.
_desiredID: ID of the user to be changing details for. Can use getUser("username")._id to retrieve this.
desiredAbout: About section to set for this user.
desiredProfile: Profile picture to set for this user.
*/
async function editInformation(_desiredId, desiredAbout, desiredProfile) {
    if (!_desiredId) {
        throw new Error("Invalid ID!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    if (!user) {
        throw new Error("User could not be found!");
    }
    if (desiredAbout === null || desiredAbout === undefined) {
        desiredAbout = user.about;
    }
    if (desiredProfile === null || desiredProfile === undefined) {
        desiredProfile = user.profile;
    }
    return userModel.findOne({ _id: _desiredId }).updateOne({ username: desiredUsername, about: desiredAbout, profile: desiredProfile });
}

/*
Same as above, but specifically for the username.
*/
async function editUsername(_desiredId, desiredUsername) {
    if (!_desiredId) {
        throw new Error("Invalid ID!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    const dup = await userModel.findOne({ username: desiredUsername });
    if (user) {
        if (!dup) {
            return userModel.updateOne({ _id: _desiredId }, { username: desiredUsername })
        }
        throw new Error("That username is taken!");
    }
    throw new Error("User could not be found!");
}

/*
Retrieves user information based on their current username. This will return all the values of the user (see user.js). Checks for a valid username.
desiredUsername: Username of the user to retrieve information for.
*/
async function getUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    let user = await userModel.find();
    console.log(user);
    if (!(await userModel.findOne({ username: desiredUsername }))) { // probably a better way to do this
        throw new Error("User could not be found!");
    }
    return userModel.findOne({ username: desiredUsername });
}

/*
Deletes a user from the database. Checks whether that user exists before modifying. Assumes that whoever is deleting has the permissions to do so.
desiredUsername: Username of the user to be deleted. Can switch for _id if needed.
*/
async function deleteUser(desiredUsername) { // how to handle things made by removed users? can we null their data so theyre not technically removed from the db?
    //log out user as well on frontish end
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("This user does not exist!")
    }
    return userModel.deleteOne({ username: desiredUsername }); //want to change to use user for less db queries
}

export default {
    createUser, editInformation, editUsername, deleteUser, getUser, setAsModerator, setAsRegular
};