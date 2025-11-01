import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from "./user.js";

dotenv.config();
mongoose.set("debug", true);

mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

async function createUser(desiredUsername) { // if we add a password, it should be hashed by this point
    if (!desiredUsername) {
        throw new Error("Username cannot be empty!");
    }
    if (( await userModel.findOne({ username: desiredUsername }) ) === null) {
        return userModel.insertOne({ username: desiredUsername });
    };
    throw new Error(`The username ${desiredUsername} is taken!`);
}

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

async function getUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if ((await userModel.findOne({ username: desiredUsername })) == undefined) { // probably a better way to do this
        throw new Error("User could not be found!");
    }
    return userModel.findOne({ username: desiredUsername });
}

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