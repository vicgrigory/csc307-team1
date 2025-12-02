import fileModel from "./file.js";
import service from "./services.js";
import userFunctions from "./user-services.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, ".env"),
  override: false,
  // quiet: true // Silences dot.env logs.
});
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined at runtime!");
}

mongoose.set("debug", true);
await mongoose
  .connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
  })
  .catch((error) => console.log(error));

/*
Add a file.
Returns a promise for that file (one JSON).
*/
async function addFile(
  desiredUsername,
  fileTitle,
  fileLink,
  fileType,
  fileCreator,
  fileDate,
  fileTags,
) {
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
      tags: fileTags,
    });
  } catch (error) {
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
  let fileIdObj;
  try {
    fileIdObj = service.makeObjectId(fileId);
  } catch (error) {
    throw new Error("FID: Not a string!");
  }
  const f = await fileModel.findOne({ _id: fileIdObj });
  if (!f) {
    throw new Error("FID: 404!");
  }
  try {
    return fileModel.findOne({ _id: fileIdObj });
  } catch (error) {
    throw new Error("Mongo: error!", error);
  }
}

/*
Edit a file. Tags must be an array.
Returns a promise for that file (one JSON).
*/
async function editFile(
  fileId,
  desiredUsername,
  fileTitle,
  fileCreator,
  fileDate,
  fileTags,
) {
  if (!fileId) {
    throw new Error("FID: invalid!");
  }
  if (!desiredUsername) {
    throw new Error("Username: invalid!");
  }
  if (fileTags && !Array.isArray(fileTags)) {
    throw new Error("Tags: not an array!");
  }
  let fileIdObj;
  try {
    fileIdObj = service.makeObjectId(fileId);
  } catch (error) {
    throw new Error("FID: Not a string!");
  }
  const f = await getFile(fileId);
  if (!f) {
    throw new Error("FID: 404!");
  }
  const u = await userFunctions.getUser(desiredUsername);
  if (!u) {
    throw new Error("Username: 404!");
  }
  if (!u._id.equals(f.userID) && u.type != "moderator") {
    throw new Error("Username: unauthorized!");
  }
  if (!fileTitle) {
    fileTitle = f.title;
  }
  if (fileCreator === null || fileCreator === undefined) {
    fileCreator = f.creator;
  }
  if (fileDate === null || fileDate === undefined) {
    fileDate = f.creationDate;
  }
  if (fileTags === null || fileTags === undefined) {
    fileTags = f.tags;
  }
  try {
    return fileModel.updateOne(
      { _id: fileIdObj },
      {
        title: fileTitle,
        creator: fileCreator,
        creationDate: fileDate,
        tags: fileTags,
      },
    );
  } catch (error) {
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
  let fileIdObj;
  try {
    fileIdObj = service.makeObjectId(fileId);
  } catch (error) {
    throw new Error("FID: Not a string!");
  }
  const f = await getFile(fileId);
  if (!f) {
    throw new Error("FID: 404!");
  }
  const u = await userFunctions.getUser(desiredUsername);
  if (!u) {
    throw new Error("Username: 404!");
  }
  if (!u._id.equals(f.userID) && u.type != "moderator") {
    throw new Error("Username: unauthorized!");
  }
  try {
    return fileModel.findByIdAndDelete(fileIdObj);
  } catch (error) {
    throw new Error("Mongo: error!", error);
  }
}

/*
Search through files. Tags are custom, but must be in an array.
Returns a promise of a list of files (array of JSONs).
*/
function searchFiles(query, type, tag) {
  if (query === undefined) {
    query = null;
  }
  if (tag === undefined) {
    tag = null;
  }
  if (type === undefined) {
    type = null;
  }
  if (!!tag && !Array.isArray(tag)) {
    throw new Error("Tags: not an array!");
  }
  if (!!type && !Array.isArray(type)) {
    throw new Error("Type: not an array!");
  }
  switch (true) {
    case !query && !tag && !type:
      try {
        return fileModel.find();
      } catch (error) {
        throw new Error("Mongo: error [none, none, none]!", error);
      }
    case !query && !tag:
      try {
        return fileModel.find({ filetype: { $in: type } });
      } catch (error) {
        throw new Error("Mongo: error [none, type, none]!", error);
      }
    case !query && !type:
      try {
        return fileModel.find({ tags: { $all: tag } });
      } catch (error) {
        throw new Error("Mongo: error [none, none, tags]!", error);
      }
    case !tag && !type:
      try {
        return fileModel.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { creator: { $regex: query, $options: "i" } },
          ],
        });
      } catch (error) {
        throw new Error("Mongo: error [query, none, none]!", error);
      }
    case !query:
      try {
        return fileModel.find({ filetype: { $in: type }, tags: { $all: tag } });
      } catch (error) {
        throw new Error("Mongo: error [none, type, tags]!", error);
      }
    case !tag:
      try {
        return fileModel.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { creator: { $regex: query, $options: "i" } },
          ],
          filetype: { $in: type },
        });
      } catch (error) {
        throw new Error("Mongo: error [query, type, none]!", error);
      }
    case !type:
      try {
        return fileModel.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { creator: { $regex: query, $options: "i" } },
          ],
          tags: { $all: tag },
        });
      } catch (error) {
        throw new Error("Mongo: error [query, none, tags]!", error);
      }
    default:
      try {
        return fileModel.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { creator: { $regex: query, $options: "i" } },
          ],
          filetype: { $in: type },
          tags: { $all: tag },
        });
      } catch (error) {
        throw new Error("Mongo: error [query, type, tags]!", error);
      }
  }
}

async function myFiles(desiredUsername) {
  if (!desiredUsername) {
    throw new Error("Username: invalid!");
  }
  const uploader = await userFunctions.getUser(desiredUsername);
  if (!uploader) {
    throw new Error("Username: 404!");
  }
  try {
    return fileModel.find({ userID: uploader._id });
  } catch (error) {
    throw new Error("Mongo: error!", error);
  }
}

async function addFavorite(desiredUsername, fileId) {
  if (!desiredUsername) {
    throw new Error("Username: invalid!");
  }
  if (!fileId) {
    throw new Error("FID: invalid!");
  }
  let fileIdObj;
  try {
    fileIdObj = service.makeObjectId(fileId);
  } catch (error) {
    throw new Error("FID: Not a string!");
  }
  const u = await userFunctions.getUser(desiredUsername);
  if (!u) {
    throw new Error("Username: 404!");
  }
  const f = await getFile(fileId);
  if (!f) {
    throw new Error("FID: 404!");
  }
  if (u.favorites.includes(fileIdObj)) {
    throw new Error("FID: already fav'd!");
  }
  try {
    u.favorites.push(fileIdObj);
    return u.save();
  } catch (error) {
    throw new Error("Mongo: error!", error);
  }
}

async function removeFavorite(desiredUsername, fileId) {
  if (!desiredUsername) {
    throw new Error("Username: invalid!");
  }
  if (!fileId) {
    throw new Error("FID: invalid!");
  }
  let fileIdObj;
  try {
    fileIdObj = service.makeObjectId(fileId);
  } catch (error) {
    throw new Error("FID: Not a valid ID format!");
  }
  const u = await userFunctions.getUser(desiredUsername);
  if (!u) {
    throw new Error("Username: 404!");
  }
  const file = await getFile(fileId);
  if (!file) {
    throw new Error("FID: 404!");
  }
  if (!u.favorites.includes(fileIdObj)) {
    throw new Error("FID: not fav'd!");
  }
  try {
    u.favorites.pull(fileIdObj);
    return u.save();
  } catch (error) {
    throw new Error("Mongo: error!", error);
  }
}

function findFiles(query, mediaTypes = []) {
  let type = null;
  if (mediaTypes && mediaTypes.length > 0) {
    const mappedTypes = [];
    if (mediaTypes.includes("Book")) mappedTypes.push("pdf");
    if (mediaTypes.includes("Music")) mappedTypes.push("mp3");
    if (mappedTypes.length > 0) {
      type = mappedTypes;
    }
  }
  return searchFiles(query, type, null);
}

export default {
  getFile,
  addFile,
  editFile,
  removeFile,
  searchFiles,
  myFiles,
  addFavorite,
  removeFavorite,
  findFiles,
};
