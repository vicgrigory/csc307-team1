import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from "./user.js";

dotenv.config();
mongoose.set("debug", true);

//process.env.MONGODB_URI <- use this in production
await mongoose.connect("mongodb://localhost:27017/data", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).catch((error) => console.log(error));

/*
Creates a new user in the database.
Returns a promise for the new user (one JSON).
*/
async function createUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Username cannot be empty!");
    };
    if (await userModel.findOne({ username: desiredUsername })) {
        throw new Error(`The username ${desiredUsername} is taken!`);
    };
    try {
        return userModel.insertOne({ username: desiredUsername });
    } catch(error) {
        throw new Error("There was an error adding this user!");
    }
}

/*
Sets a user in the database as a moderator.
Returns a promise for the updated user (one JSON).
*/
async function setAsModerator(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("User could not be found!");
    }
    if (user.type == "regular") {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'moderator' });
    };
    throw new Error("User is already a moderator!");
}

/*
Sets a user in the database as a regular user.
Returns a promise for the updated user (one JSON).
*/
async function setAsRegular(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("User could not be found!");
    }
    if (user.type == "moderator") {
        return userModel.findOne({ username: desiredUsername }).updateOne({ type: 'regular' });
    };
    throw new Error("User is not a moderator!");
}

/*
Change nonessential user credentials.
Returns a promise for the updated user (one JSON).
*/
async function editInformation(_desiredId, desiredAbout, desiredProfile) {
    if (!_desiredId) {
        throw new Error("Invalid ID!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    if (!user) {
        throw new Error("User could not be found!");
    }
    if (desiredAbout === null || desiredAbout === undefined) {
        desiredAbout = user.about;
    }
    if (desiredProfile === null || desiredProfile === undefined) {
        desiredProfile = user.profile;
    }
    return userModel.findOne({ _id: _desiredId }).updateOne({ about: desiredAbout, profile: desiredProfile });
}

/*
Change username.
Returns a promise for the updated user (one JSON).
*/
async function editUsername(_desiredId, desiredUsername) {
    if (!_desiredId) {
        throw new Error("Invalid ID!");
    }
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    const user = await userModel.findOne({ _id: _desiredId });
    const dup = await userModel.findOne({ username: desiredUsername });
    if (user) {
        if (!dup) {
            return userModel.updateOne({ _id: _desiredId }, { username: desiredUsername })
        }
        throw new Error("That username is taken!");
    }
    throw new Error("User could not be found!");
}

/*
Retrieves a user from the database from their username.
Returns a promise with desired user details (one JSON).
*/
async function getUser(desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!(await userModel.findOne({ username: desiredUsername }))) {
        throw new Error("User could not be found!");
    }
    return userModel.findOne({ username: desiredUsername });
}

/*
Deletes a user from the database.
** May alter this to redact their credentials so files can retain information.
** May alter this to require an ID to check for authentication.
Returns a promise for the deleted user (one JSON).
*/
async function deleteUser(userID, desiredUsername) {
    if (!desiredUsername) {
        throw new Error("Invalid username!");
    }
    if (!userID) {
        throw new Error("Please provide a user ID to perform this action!");
    }
    const user = await userModel.findOne({ username: desiredUsername });
    if (!user) {
        throw new Error("This user does not exist!")
    }
    const action = await userModel.findOne({ _id: userID });
    if (!action) {
        throw new Error("User ID provided does not correspond to a user!");
    }
    if ((!action._id.equals(user._id)) && (action.type != 'moderator')) {
        throw new Error("Unauthorized!");
    }
    return userModel.deleteOne({ username: desiredUsername });
}

export default {
    createUser, editInformation, editUsername, deleteUser, getUser, setAsModerator, setAsRegular
};