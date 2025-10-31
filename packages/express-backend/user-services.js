import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from "./user.js";

dotenv.config();
mongoose.set("debug", true);

mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

function createUser(username) { // if we add a password, it should be hashed by this point
    const userToAdd = new userModel({ username: username });
    const promise = userToAdd.save();
    return promise;
}

function setAsModerator(username) {
    return userModel.findOne({ username: username }).updateOne({ type: 'moderator' });
}

function setAsRegular(username) {
    return userModel.findOne({ username: username }).updateOne({ type: 'regular' });
}

function editUser(_id, username, about, profile) {
    return userModel.findOne({ _id: _id }).updateOne({ username: username, about: about, profile: profile });
}

function getUser(username) {
    return userModel.findOne({ username: username });
}

function addFavorite(username, fileID, ...list) {
    if (!list.includes(fileID)) {
        listAdded = list.concat(fileID);
        return userModel.findOne({ username: username }).updateOne({ favorites: listAdded });
    }
    return 0; // no action taken, item already in favorites
}

function removeFavorite(username, fileID, ...list) {
    const index = list.indexOf(fileID);
    if (index > -1) {
        list.splice(index, 1); // id like to do this w/o modifying the original array
        return userModel.findOne({ username: username }).updateOne({ favorites: list });
    }
    return 1;
}

function deleteMyUser(username) { // how to handle things made by removed users? can we null their data so theyre not technically removed from the db?
    //log out user as well
    return userModel.findOneAndDelete({ username: username });
}

function deleteOtherUser(_modId, _deleteId) { // need to add mod column in user table
    const mod = userModel.findOne({ _id: _modId });
    if (mod.type == 'moderator') {
        return userModel.findByIdAndDelete(_id);
    }
    return 401; // Not authorized
}

export default {
    createUser, editUser, deleteMyUser, deleteOtherUser, getUser, addFavorite, removeFavorite, setAsModerator, setAsRegular
};