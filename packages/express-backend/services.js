import mongoose from "mongoose";

function makeObjectId(key) {
    if (typeof(key) !== 'string') {
        throw new Error("Key: not string!");
    }
    try {
        return new mongoose.Types.ObjectId(key);
    } catch(error) {
        throw new Error("Key: failed to create ID!");
    }
};

export default { makeObjectId };