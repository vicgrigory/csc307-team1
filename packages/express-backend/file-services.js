import mongoose from "mongoose";
import fileModel from "./file";
import userFunctions from "./user-services";
import userModel from "./user";

/*
Add a file.
Returns a promise for that file (one JSON).
*/
async function addFile(desiredUsername, fileTitle, fileLink, fileType, fileCreator, fileDate, fileTags) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!fileTitle) {
        throw new Error("Title: invalid!");
    }
    if (!fileLink) {
        throw new Error("Link: invalid!");
    }
    if (!fileType) {
        throw new Error("Type: invalid!");
    }
    if (fileTags && !Array.isArray(fileTags)) {
        throw new Error("Tags: not an array!");
    }
    const uploader = await userFunctions.getUser(desiredUsername);
    if (!uploader) {
        throw new Error("Username: 404!");
    }
    try {
        return fileModel.insertOne({
            title: fileTitle,
            link: fileLink,
            filetype: fileType,
            userID: uploader._id,
            creator: fileCreator,
            creationDate: fileDate,
            tags: fileTags
        });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Get a file by its ID.
Returns a promise for that file (one JSON).
*/
async function getFile(fileId) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    const f = await fileModel.findOne({ _id: fileId});
    if (!f) {
        throw new Error("FID: 404!");
    }
    try {
        return fileModel.findOne({ _id: fileId });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }  
}

/*
Edit a file. Tags must be an array.
Returns a promise for that file (one JSON).
*/
async function editFile(fileId, desiredUsername, fileTitle, fileCreator, fileDate, fileTags) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (fileTags && !Array.isArray(fileTags)) {
        throw new Error("Tags: not an array!");
    }
    const f = await fileModel.findOne({_id: fileId});
    if (!f) {
        throw new Error("FID: 404!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    if ((!u._id.equals(f.userID)) && (u.type != 'moderator')) {
        throw new Error("Username: unauthorized!");
    }
    if (!fileTitle) {
        fileTitle = f.title;
    }
    if (fileCreator === null || fileCreator === undefined) {
        fileCreator = f.creator; // Excludes ""
    }
    if (fileDate === null || fileDate === undefined) {
        fileDate = f.creationDate;
    }
    if (fileTags === null || fileTags === undefined) {
        fileTags = f.tags; // Can set to []
    }
    try {
        return fileModel.updateOne({ _id: fileId }, { title: fileTitle, creator: fileCreator, creationDate: fileDate, tags: fileTags });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Delete a file.
Returns a promise for that file (one JSON).
*/
async function removeFile(fileId, desiredUsername) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const f = await fileModel.findOne({ _id: fileId });
    const u = await userFunctions.getUser(desiredUsername);
    if (!f) {
        throw new Error("FID: 404!");
    }
    if (!u) {
        throw new Error("Username: 404!");
    }
    if ((!u._id.equals(f.userID)) && (u.type != 'moderator')) {
        throw new Error("Username: unauthorized!");
    }
    try {
        return fileModel.findByIdAndDelete(fileId);
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Search through files. Tags are custom, but must be in an array.
Returns a promise of a list of files (array of JSONs).
*/
function searchFiles(query, tag) {
    if (query === undefined) {
        query = null;
    }
    if (tag === undefined) {
        tag = null;
    }
    if ((!!tag) && !Array.isArray(tag)) {
        throw new Error("Tags: not an array!");
    }
    if (!query) {
        if (tag===null || tag.length == 0) {
            try {
                return fileModel.find();
            } catch(error) {
                throw new Error("Mongo: error [none, none]!", error);
            }   
        }
        try {
            return fileModel.find({ tags: {$all: tag}});
        } catch(error) {
            throw new Error("Mongo: error [none, tags]!", error);
        }
    } else if (query) {
        if (tag===null || tag.length == 0) {
            try {
                return fileModel.find({ $or: [{ title: { $regex: query, $options:'i' }}, { creator: { $regex: query, $options: 'i'}}] });
            } catch(error) {
                throw new Error("Mongo: error [query, none]!", error);
            }
        }
        try {
            return fileModel.find({ $or: [{ title: { $regex: query, $options:'i' }}, { creator: { $regex: query, $options: 'i'}}], tags: {$all: tag}});
        } catch(error) {
            throw new Error("Mongo: error [query, tags]!", error);
        }
    }
}

/*
Get all files uploaded by a user.
Returns a promise of a list of files (array of JSONs).
*/
async function myFiles(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const uploader = await userFunctions.getUser(desiredUsername);
    if (!uploader) {
        throw new Error("Username: 404!"); // If we delete users, keeping their ID in the database would be useful if we want to keep their files.
    }
    try {
        return fileModel.find({ userID: uploader._id });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Add a file to a user's favorites.
Returns a promise for that user (one JSON).
*/
async function addFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    const f = await fileModel.findOne({ _id: fileId });
    if (!f) {
        throw new Error("FID: 404!");
    }
    if (u.favorites.includes(fileId)) {
        throw new Error("FID: already fav'd!");
    }
    try {
        u.favorites.push(fileId);
        return u.save();
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Remove a file from a user's favorites.
Returns a promise for that user (one JSON).
*/
async function removeFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }
    const file = await getFile(fileId);
    if (!file) {
        throw new Error("FID: 404!");
    }
    if (!u.favorites.includes(fileId)) {
        throw new Error("FID: not fav'd!");
    }
    try {
        u.favorites.pull(fileId);
        return u.save();
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

export default {
    getFile, addFile, editFile, removeFile, searchFiles, myFiles, addFavorite, removeFavorite
};