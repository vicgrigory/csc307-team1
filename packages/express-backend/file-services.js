import mongoose from "mongoose";
import fileModel from "./file.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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

mongoose
  .connect("process.env.MONGODB_URI", {
    useNewUrlParser: true,
    useUNifiedTopology: true,
  })
  .catch((error) => console.log(error));

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

// adding a file
function addFile(file) {
  const fileToAdd = new fileModel(file);
  const promise = fileToAdd.save();
  return promise;
}

// removing a file
/* need to have appropriate permissions */
function removeFile(fileID) {
  return fileModel.findByIdAndDelete(fileID);
}

// accepts a query string and an array of media types
function findFiles(query, mediaTypes = []) {
  let searchCriteria = {};

  // 1. Text Search (Title or Creator)
  if (query) {
    searchCriteria.$or = [
      { title: { $regex: query, $options: "i" } },
      { creator: { $regex: query, $options: "i" } },
    ];
  }

  // 2. Filter by FileType (Mapping Frontend "Media Type" to Backend "filetype")
  // Frontend: "Book", "Music", "Film"
  // Backend Schema: "pdf", "mp3"
  if (mediaTypes && mediaTypes.length > 0) {
    const fileTypeFilters = [];
    if (mediaTypes.includes("Book")) fileTypeFilters.push("pdf");
    if (mediaTypes.includes("Music")) fileTypeFilters.push("mp3");
    // 'Film' currently has no mapping in the provided Schema, so we ignore it or add if schema updates

    if (fileTypeFilters.length > 0) {
      searchCriteria.filetype = { $in: fileTypeFilters };
    }
  }

  // Note: Subject and genre are not currently in the schema,
  // so we cannot filter by them on the backend yet.

  return fileModel.find(searchCriteria);
}

// applying tags to a query
/*
Pass in the search query, as well as the list of tags currently marked.
*/
function applyTag(query, ...tags) {
  tagQuery = "";
  for (i = 0; i < tags.length; i++) {
    // havent tested whether this actually works lol
    if (i == tags.length - 1) {
      tagQuery += `'${tags[i]}`;
    }
    tagQuery += `'${tags[i]}', `;
  }
  console.log(tagQuery);
  return fileModel.find().where({ name: query, tags: tagQuery });
}

export default {
  addFile,
  removeFile,
  findFiles,
  applyTag,
};
