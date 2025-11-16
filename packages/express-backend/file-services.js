import mongoose from "mongoose";
import fileModel from "./file";
import userFunctions from "./user-services";

mongoose.set("debug", true);

//process.env.MONGODB_URI <- use this in production
await mongoose.connect("mongodb://localhost:27017/data", {
//    useNewUrlParser: true,
//    useUNifiedTopology: true
}).catch((error) => console.log(error));

/*
Add a file.
Returns a promise for that file (one JSON).
*/
async function addFile(desiredUsername, fileTitle, fileLink, fileType, fileCreator, fileDate, fileTags) {
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
    if (fileTags && !Array.isArray(fileTags)) {
        throw new Error("Tags must be in an array!");
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
        throw new Error("An error occured while adding your file!");
    }
    
}

/*
Get a file by its ID.
Returns a promise for that file (one JSON).
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
Edit a file. Tags must be an array.
Returns a promise for that file (one JSON).
*/
async function editFile(fileId, desiredUsername, fileTitle, fileCreator, fileDate, fileTags) {
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
    if (!fileTags) {
        fileTags = file.tags;
    }
    if (!Array.isArray(fileTags)) {
        throw new Error("Tags must be in an array!");
    }
    try {
        return fileModel.updateOne({ _id: fileId }, { title: fileTitle, creator: fileCreator, creationDate: fileDate, tags: fileTags });
    } catch(error) {
        throw new Error("An error occured while editing your file!");
    }
}

/*
Delete a file.
Returns a promise for that file (one JSON).
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
        throw new Error("Please use an array when searching tags!");
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
                return fileModel.find({ $or: [{ title: { $regex: query, $options:'i' }}, { creator: { $regex: query, $options: 'i'}}] });
            } catch(error) {
                throw new Error("An error occured while searching for files [query only]!");
            }
        }
        try {
            return fileModel.find({ $or: [{ title: { $regex: query, $options:'i' }}, { creator: { $regex: query, $options: 'i'}}], tags: {$all: tag}});
        } catch(error) {
            throw new Error("An error occured while searching for files [query and tags]!");
        }
    }
}

/*
Get all files uploaded by a user.
Returns a promise of a list of files (array of JSONs).
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
Add a file to a user's favorites.
Returns a promise for that user (one JSON).
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
Remove a file from a user's favorites.
Returns a promise for that user (one JSON).
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