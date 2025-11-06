import mongoose from "mongoose";
import fileModel from "./file.js";
import userFunctions from "./user-services.js";

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/data", {
//    useNewUrlParser: true,
//    useUNifiedTopology: true
}).catch((error) => console.log(error));

/*
How I'm implementing filters:
- pressing the filter buttons automatically requeries the database and pulls up the results
- search searches by filename unless otherwise specified
- filters: filetype (dropdown menu?), tags
    these need to be queried uniquely to find all tags / filetypes, then shown on the react page
- *possible sortbys: title, upload date, creation date
- *possible extra search filters: creator

* may be out of scope, will not implement until we're confirmed doing so
*/

/*
Adds a file into the database. This requires a title, link to the file, the specified filetype (can implement this if needed), and the user ID of the uploader.
desiredUsername: Username of the user uploading the file.
fileTitle: Title of the file, shown on webpages instead of the link/ filename.
fileLink: Link to the file, where the user will be directed if they wish to view it. Can use for embedding as well. Validity should be handled on the backend, if at all.
fileType: Type of file (pdf, mp3, etc.). Function will error handle if this is not currently supported. Can optionally add a way to extract from the link.
*/
async function addFile(desiredUsername, fileTitle, fileLink, fileType, fileCreator, fileDate) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!fileTitle) {
        throw new Error("Must define a file title!");
    }
    if (!fileLink) {
        throw new Error("Must define a file link!");
    }
    if (!fileType) {
        throw new Error("Must define a file type!");
    }
    const uploader = await userFunctions.getUser(desiredUsername);
    if (uploader) {
        return fileModel.insertOne({
            title: fileTitle,
            link: fileLink,
            filetype: fileType,
            userID: uploader._id,
            creator: fileCreator,
            creationDate: fileDate
        });
    }
    throw new Error("Username is not valid!");
}

/*
Gets a file from the database from its ID, probably better to use for the media page and not search. Can use findFiles to get a list of them and their information.
fileId: ID of the file to retrieve.
*/
async function getFile(fileId) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    const file = fileModel.findOne({ _id: fileId});
    if (!file) {
        throw new Error("File does not exist!");
    }
    return fileModel.findOne({ _id: fileId });
}

/*
Edits a file currently in the database. File link and file type are inaccessible, as that would change the post itself. Can add in if needed. Assumes the user has permissions to change the file.
fileId: ID of the file to modify. Use myFiles on the user to retrieve their files, which will populate the ID as well. Can add more robust searches if needed.
fileTitle: New title of the file. Will not modify if it is null.
fileCreator: New original creator of the file. Will not modify if it is null.
fileDate: New original date of the file. Will not modify if it is null.
*/
async function editFile(fileId, desiredUsername, fileTitle, fileCreator, fileDate) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    const file = await fileModel.getFile(fileId);
    if (!file) {
        throw new Error("File ID does not correspond to a valid file!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (file.userID != user._id) {
        throw new Error("Not authorized!");
    }
    if (!fileTitle) {
        fileTitle = file.title;
    }
    if (fileCreator === null || fileCreator === undefined) {
        fileCreator = file.creator;
    }
    if (fileDate === null || fileDate === undefined) {
        fileDate = file.creationDate;
    }
    return fileModel.updateOne({ _id: fileId }, { title: fileTitle, creator: fileCreator, creationDate: fileDate });
}

/*
Removes a file from the database. Requires the fileID, assumes the backend checks whether the user owns the file/ has permissions to delete it.
fileID: File ID of the media to remove.
*/
async function removeFile(fileId) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    if (await fileModel.findOne({ _id: fileId })) {
        return fileModel.findByIdAndDelete(fileId);
    }
    throw new Error("File could not be found!");
}

/*
Searches the database for desired files. Tags are not necessary, but each addition of a tag needs this function to be called again.
query: The search query. Can probably implement a way to search other things, but right now it searches the name.
tags: (optional) The tags applied to the search query, should be an array of strings.
*/
function searchFiles(query, ...tags) {
    if (!query) {
        if (tags) {
            return fileModel.find().where({ tags: { $all: tags } });
        }
        return fileModel.find();
    }
    if (!tags) {
        return fileModel.find().where({ name: /query/i });
    }
    return fileModel.find().where({ name: /query/i, tags: { $all: tags } })
}

function myFiles(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const uploader = userFunctions.getUser(desiredUsername);
    if (uploader) {
        return fileModel.find({ userID: uploader._id });
    }
    throw new Error("User could not be found!"); // If we delete users, keeping their ID in the database would be useful if we want to keep their files.
}

/* -------- NOT TESTED YET
Adds a file to a list of favorites. Checks whether that file exists and is already in the list before modifying.
desiredUsername: Username of the user adding the file to their favorites.
fileID: File ID of the file to be added to the list.
list: [WILL BE REMOVING] List of the user's current favorites.
*/
function addFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!fileID) { // Add file check in here. Refer to getFile in its services.
        throw new Error("Invalid file specified!");
    }
    if (!list.includes(fileId)) {
        listAdded = list.concat(fileId);
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
function removeFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!fileId) { // Add file check.
        throw new Error("Invalid file specified!");
    }
    const index = list.indexOf(fileId);
    if (index > -1) {
        // id like to do this w/o modifying the original array at some point
        list.splice(index, 1);
        return userModel.findOne({ username: desiredUsername }).updateOne({ favorites: list });
    }
    throw new Error("This file is not in the list!");
}

export default {
    getFile, addFile, editFile, removeFile, searchFiles, myFiles, addFavorite, removeFavorite
};