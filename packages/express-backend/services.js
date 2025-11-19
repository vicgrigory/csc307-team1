import mongoose from "mongoose";

function makeObjectId(key) {
    if (typeof(key) !== 'string') {
        throw new Error("Key: not string!");
    }
    try {
        return new mongoose.Types.ObjectId(key);
    } catch(error) {
        throw new Error("Key: failed to create ID!", error);
    }
};

function makeString(key) {
    try {
        return key.toString();
    } catch(error) {
        throw new Error("Key: failed to create String!", error);
    }
}

export default { makeObjectId, makeString };