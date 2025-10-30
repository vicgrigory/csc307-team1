import mongoose from "mongoose";
import userModel from "./user.js";

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/users", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

function createUser(username) { // if we add a password, it should be hashed by this point
    const userToAdd = new userModel({ username: username });
    const promise = userToAdd.save();
    return promise;
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
    //log out
    return userModel.findOneAndDelete({ username: username });
}

function deleteOtherUser(_id) { // need to add mod column in user table
    return userModel.findByIdAndDelete(_id);
}

export default {
    createUser, editUser, deleteMyUser, deleteOtherUser, getUser, addFavorite, removeFavorite
};