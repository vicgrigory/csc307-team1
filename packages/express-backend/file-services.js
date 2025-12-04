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
});
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined at runtime!");
}

mongoose.set("debug", true);
await mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .catch((error) => console.log(error));


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


function escapeRegex(string) {
  if (!string) return string;
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


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

  const escapedQuery = query ? escapeRegex(query) : null;
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
            { title: { $regex: escapedQuery, $options: "i" } },
            { creator: { $regex: escapedQuery, $options: "i" } },
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
            { title: { $regex: escapedQuery, $options: "i" } },
            { creator: { $regex: escapedQuery, $options: "i" } },
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
            { title: { $regex: escapedQuery, $options: "i" } },
            { creator: { $regex: escapedQuery, $options: "i" } },
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
            { title: { $regex: escapedQuery, $options: "i" } },
            { creator: { $regex: escapedQuery, $options: "i" } },
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

function findFiles(query, mediaTypes = [], tags = []) {
  let type = null;
  if (mediaTypes && mediaTypes.length > 0) {
    const mappedTypes = [];
    for (const mediaType of mediaTypes) {
      if (mediaType === "Book" || mediaType === "PDF") mappedTypes.push("pdf");
      else if (mediaType === "Music" || mediaType === "MP3") mappedTypes.push("mp3");
      else mappedTypes.push(mediaType.toLowerCase());
    }
    if (mappedTypes.length > 0) {
      type = [...new Set(mappedTypes)];
    }
  }
  const tagArray = tags && tags.length > 0 ? tags : null;
  return searchFiles(query, type, tagArray);
}

async function getAllTags() {
  try {
    const files = await fileModel.find({ tags: { $exists: true, $ne: [] } }, { tags: 1 });
    const allTags = files.flatMap(file => file.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags;
  } catch (error) {
    throw new Error("Mongo: error getting tags!", error);
  }
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
  getAllTags,
};
