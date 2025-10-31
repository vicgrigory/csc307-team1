import mongoose from "mongoose";
import fileModel from "./file.js";

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUNifiedTopology: true
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

// searching for a file
function findFiles(query) {
    return fileModel.find().where({ name: query });
}

// applying tags to a query
/*
Pass in the search query, as well as the list of tags currently marked.
*/
function applyTag(query, ...tags) {
    tagQuery = "";
    for (i=0; i<tags.length; i++) { // havent tested whether this actually works lol
        if (i==tags.length-1) {
            tagQuery += `'${tags[i]}`;
        }
        tagQuery += `'${tags[i]}', `;
    }
    console.log(tagQuery);
    return fileModel.find().where({ name: query, tags: tagQuery })
}

export default {
    addFile, removeFile, findFiles, applyTag
};