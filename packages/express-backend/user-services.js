import userModel from "./user";

/*
Creates a new user in the database.
Returns a promise for the new user (one JSON).
*/
async function createUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    };
    if (await userModel.findOne({ username: desiredUsername })) {
        throw new Error(`Username: duplicate!`);
    };
    try {
        return userModel.insertOne({ username: desiredUsername });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Sets a user in the database as a moderator.
Returns a promise for the updated user (one JSON).
*/
async function setAsModerator(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const u = await userModel.findOne({ username: desiredUsername });
    if (!u) {
        throw new Error("Username: 404!");
    }
    if (u.type == "moderator") {
        throw new Error("Type: already a mod!");
    };
    try {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'moderator' });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Sets a user in the database as a regular user.
Returns a promise for the updated user (one JSON).
*/
async function setAsRegular(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const u = await userModel.findOne({ username: desiredUsername });
    if (!u) {
        throw new Error("Username: 404!");
    }
    if (u.type == "regular") {
        throw new Error("Type: already regular!");  
    };
    try {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'regular' });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Change nonessential user credentials.
Returns a promise for the updated user (one JSON).
*/
async function editInformation(_desiredId, desiredAbout, desiredProfile) {
    if (!_desiredId) {
        throw new Error("UID: invalid!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    if (!user) {
        throw new Error("UID: 404!");
    }
    if (desiredAbout === null || desiredAbout === undefined) {
        desiredAbout = user.about; // Excludes ""
    }
    if (desiredProfile === null || desiredProfile === undefined) {
        desiredProfile = user.profile;
    }
    try {
        return userModel.findOne({ _id: _desiredId }).updateOne({ about: desiredAbout, profile: desiredProfile });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Change username.
Returns a promise for the updated user (one JSON).
*/
async function editUsername(_desiredId, desiredUsername) {
    if (!_desiredId) {
        throw new Error("UID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    if (!user) {
        throw new Error("UID: 404!");
    }
    const dup = await userModel.findOne({ username: desiredUsername });
    if (dup) {
        throw new Error("Username: duplicate!");
    }
    try {
        return userModel.updateOne({ _id: _desiredId }, { username: desiredUsername });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Retrieves a user from the database from their username.
Returns a promise with desired user details (one JSON).
*/
async function getUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    const u = await userModel.findOne({ username: desiredUsername }); // Clone error here.
    
    if (!u) {
        throw new Error("Username: 404!");
    }
    try {
        return userModel.findOne({ username: desiredUsername });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

/*
Deletes a user from the database.
** May alter this to redact their credentials instead so files can retain information.
Returns a promise for the deleted user (one JSON).
*/
async function deleteUser(userID, desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!userID) {
        throw new Error("UID: invalid!");
    }
    const u = await userModel.findOne({ username: desiredUsername });
    if (!u) {
        throw new Error("Username: 404!")
    }
    const action = await userModel.findOne({ _id: userID });
    if (!action) {
        throw new Error("UID: 404!");
    }
    if ((!action._id.equals(u._id)) && (action.type != 'moderator')) {
        throw new Error("UID: unauthorized!");
    }
    try {
        return userModel.deleteOne({ username: desiredUsername });
    } catch(error) {
        throw new Error("Mongo: error!", error);
    }
}

export default {
    createUser, editInformation, editUsername, deleteUser, getUser, setAsModerator, setAsRegular
};