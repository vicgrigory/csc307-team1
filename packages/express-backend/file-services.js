import mongoose from "mongoose";
import dotenv from 'dotenv';
import fileModel from "./file.js";
import userModel from "./user";
import userFunctions from "./user-services.js";

mongoose.set("debug", true);

//process.env.MONGODB_URI <- use this in production
await mongoose.connect("mongodb://localhost:27017/data", {
//    useNewUrlParser: true,
//    useUNifiedTopology: true
}).catch((error) => console.log(error));

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
    if (!uploader) {
        throw new Error("Username is not valid!");
    }
    try {
        return fileModel.insertOne({
            title: fileTitle,
            link: fileLink,
            filetype: fileType,
            userID: uploader._id,
            creator: fileCreator,
            creationDate: fileDate
        });
    } catch(error) {
        throw new Error("An error occured while adding your file!");
    }
    
}

/*
Gets a file from the database from its ID, probably better to use for the media page and not search. Can use findFiles to get a list of them and their information.
fileId: ID of the file to retrieve.
*/
async function getFile(fileId) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    const file = await fileModel.findOne({ _id: fileId});
    if (!file) {
        throw new Error("File does not exist!");
    }
    try {
        return fileModel.findOne({ _id: fileId });
    } catch(error) {
        throw new Error("An error occured while getting your file!");
    }  
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
    const file = await fileModel.findOne({_id: fileId});
    if (!file) {
        throw new Error("File ID does not correspond to a valid file!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if ((!user._id.equals(file.userID)) && (user.type != 'moderator')) {
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
    try {
        return fileModel.updateOne({ _id: fileId }, { title: fileTitle, creator: fileCreator, creationDate: fileDate });
    } catch(error) {
        throw new Error("An error occured while editing your file!");
    }
}

/* need a function to alter tags */

/*
Removes a file from the database. Requires the fileID and username.
fileID: File ID of the media to remove.
desiredUsername: Username of the user trying to complete the action.
*/
async function removeFile(fileId, desiredUsername) {
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const file = await fileModel.findOne({ _id: fileId });
    const user = await userFunctions.getUser(desiredUsername);
    if (!file) {
        throw new Error("File could not be found!");
    }
    if (!user) {
        throw new Error("User could not be found!");
    }
    if ((!user._id.equals(file.userID)) && (user.type != 'moderator')) {
        throw new Error("User is unauthorized to perform this action!");
    }
    try {
        return fileModel.findByIdAndDelete(fileId);
    } catch(error) {
        throw new Error("An error occured while removing your file!");
    }
}

/*
Searches the database for desired files. Tags are not necessary, but each addition of a tag needs this function to be called again.
query: The search query. Can probably implement a way to search other things, but right now it searches the name.
tags: (optional) The tags applied to the search query, should be an array of strings.
*/
function searchFiles(query, tag) {
    if (query === undefined) {
        query = null;
    }
    if (tag === undefined) { // check if tag is array or not
        tag = null;
    }
    if (!query) {
        if (tag===null || tag.length == 0) {
            try {
                return fileModel.find();
            } catch(error) {
                throw new Error("An error occured while searching for files [no input]!");
            }   
        }
        try {
            return fileModel.find({ tags: {$all: tag}});
        } catch(error) {
            throw new Error("An error occured while searching for files [tags only]!");
        }
    } else if (query) {
        if (tag===null || tag.length == 0) {
            try {
                return fileModel.find({ title: { $regex: query, $options:'i' }});
            } catch(error) {
                throw new Error("An error occured while searching for files [query only]!");
            }
        }
        try {
            return fileModel.find({ title: {$regex: query, $options:'i' }, tags: {$all: tag} });
        } catch(error) {
            throw new Error("An error occured while searching for files [query and tags]!");
        }
    }
}

/*
Gets all files uploaded by a specific user.
desiredUsername: Username of the user to search files for.
*/
async function myFiles(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const uploader = await userFunctions.getUser(desiredUsername);
    if (!uploader) {
        throw new Error("User could not be found!"); // If we delete users, keeping their ID in the database would be useful if we want to keep their files.
    }
    try {
        return fileModel.find({ userID: uploader._id });
    } catch(error) {
        throw new Error("An error occured while getting this user's files!");
    }
}

/*
Adds a file to a list of favorites. Checks whether that file exists and is already in the list before modifying.
desiredUsername: Username of the user adding the file to their favorites.
fileId: File ID of the file to be added to the list.
*/
async function addFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to a valid user!");
    }
    if (!fileId) {
        throw new Error("Invalid file ID!");
    }
    const file = await fileModel.findOne({ _id: fileId });
    if (!file) {
        throw new Error("File ID does not correspond to a valid file!");
    }
    if (user.favorites.includes(fileId)) {
        throw new Error("This file is already in the list!");
    }
    try {
        user.favorites.push(fileId);
        return user.save();
    } catch(error) {
        throw new Error("An error occured while adding this file to favorites!", error);
    }
}

/*
Removes a file from a list of favorites. Checks whether that file exists and is in the list before modifying.
desiredUsername: Username of the user to be added to the list.
fileId: File ID of the file to be added to the list.
*/
async function removeFavorite(desiredUsername, fileId) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userFunctions.getUser(desiredUsername);
    if (!user) {
        throw new Error("Username does not correspond to valid user!");
    }
    if (!fileId) {
        throw new Error("Invalid file specified!");
    }
    const file = await fileModel.findOne({ _id: fileId });
    if (!file) {
        throw new Error("File ID does not correspond to a valid file!");
    }
    if (!user.favorites.includes(fileId)) {
        throw new Error("This file is not in the list!");
    }
    try {
        user.favorites.pull(fileId);
        return user.save();
    } catch(error) {
        throw new Error("An error occured while removing this file from favorites!");
    }
}

export default {
    getFile, addFile, editFile, removeFile, searchFiles, myFiles, addFavorite, removeFavorite
};