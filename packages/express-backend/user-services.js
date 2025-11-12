import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from "./user.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, ".env"),
  override: false,
  // quiet: true,  // uncomment to silence dotenv logs
});

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined at runtime");
}

mongoose.set("debug", true);

mongoose.connect(process.env.MONGODB_URI, {
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
    if (( await userModel.findOne({ username: desiredUsername }) ) === null) {
        return userModel.insertOne({ username: desiredUsername });
    };
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

/* -------- WILL BE EDITING
Edits user credentials by replacing the current ones with what is entered. Checks for a valid id, since the username is able to be changed.
**** Will probably change this to only change values when they are not null for ease of use. Let me know.
_desiredID: ID of the user to be changing details for. Can use getUser("username")._id to retrieve this.
desiredUsername: Username to set for this user.
desiredAbout: About section to set for this user.
desiredProfile: Profile picture to set for this user.
*/
async function editUser(_desiredID, desiredUsername, desiredAbout, desiredProfile) {
    if (!_desiredID) {
        throw new Error("Invalid ID!");
    }
    if (!desiredUsername) {
        throw new Error("Cannot set username to empty!");
    }
    const user = await userModel.findOne({ _id: _desiredID });
    if (!user) {
        throw new Error("User could not be found!");
    }
    return userModel.findOne({ _id: _desiredID }).updateOne({ username: desiredUsername, about: desiredAbout, profile: desiredProfile });
}

/*
Retrieves user information based on their current username. This will return all the values of the user (see user.js). Checks for a valid username.
desiredUsername: Username of the user to retrieve information for.
*/
async function getUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if ((await userModel.findOne({ username: desiredUsername })) == undefined) { // probably a better way to do this
        throw new Error("User could not be found!");
    }
    return userModel.findOne({ username: desiredUsername });
}

/* -------- NOT TESTED YET
Adds a file to a list of favorites. Checks whether that file exists and is already in the list before modifying.
desiredUsername: Username of the user adding the file to their favorites.
fileID: File ID of the file to be added to the list.
list: [WILL BE REMOVING] List of the user's current favorites.
*/
function addFavorite(desiredUsername, fileID, ...list) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!fileID) { // Add file check in here. Refer to getFile in its services.
        throw new Error("Invalid file specified!");
    }
    if (!list.includes(fileID)) {
        listAdded = list.concat(fileID);
        return userModel.findOne({ username: desiredUsername }).updateOne({ favorites: listAdded });
    }
    throw new Error("This file is already in the list!");
}

/* -------- NOT TESTED YET
Removes a file from a list of favorites. Checks whether that file exists and is in the list before modifying.
desiredUsername: Username of the user to be added to the list.
fileID: File ID of the file to be added to the list.
list: [WILL BE REMOVING] List of the user's current favorites.
*/
function removeFavorite(desiredUsername, fileID, ...list) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!fileID) { // Add file check.
        throw new Error("Invalid file specified!");
    }
    const index = list.indexOf(fileID);
    if (index > -1) {
        // id like to do this w/o modifying the original array at some point
        list.splice(index, 1);
        return userModel.findOne({ username: desiredUsername }).updateOne({ favorites: list });
    }
    throw new Error("This file is not in the list!");
}

/*
Deletes a user from the database. Checks whether that user exists before modifying.
desiredUsername: Username of the user to be deleted. Can switch for _id if needed.
*/
async function deleteMyUser(desiredUsername) { // how to handle things made by removed users? can we null their data so theyre not technically removed from the db?
    //log out user as well on frontish end
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    console.log(`user: ${user}`)
    if (!user) {
        throw new Error("This user does not exist!")
    }
    return userModel.deleteOne({ username: desiredUsername }); //want to change to use user for less db queries
}

/*
Allows a moderator to delete another, regular user from the database. Checks whether both user IDs exist, and if they are of the correct privileges before modifying.
_modId: ID of the moderator performing the action. Must be a moderator for this function to work.
_deletId: ID of the user to be deleted. Cannot be a moderator user, in that case must use the setAsRegular function on the desired user before removing them.
*/
async function deleteOtherUser(_modId, _deleteId) {
    if (!_modId || !_deleteId) {
        throw new Error("An ID is invalid!");
    }
    const mod = await userModel.findOne({ _id: _modId });
    const user = await userModel.findOne({ _id: _deleteId});
    if (!mod) {
        throw new Error("Mod user does not exist!");
    }
    if (!user) {
        throw new Error("User to be deleted does not exist!");
    }
    if (mod.type == 'moderator') {
        if (user.type == 'regular') {
            return userModel.findByIdAndDelete(_deleteId);
        }
        throw new Error("User to be deleted is currently a moderator, demote them first!");
    }
    throw new Error("Mod ID does not correspond to a moderator!");
}

export default {
    createUser, editUser, deleteMyUser, deleteOtherUser, getUser, addFavorite, removeFavorite, setAsModerator, setAsRegular
};
