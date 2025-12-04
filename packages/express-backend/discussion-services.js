import discussionModel from "./discussion.js";
import fileFunctions from "./file-services.js";
import userFunctions from "./user-services.js";
import service from "./services.js";
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
await mongoose.connect(process.env.MONGODB_URI, {})
    .catch((error) => console.log(error));


async function addDiscussion(fileId, desiredUsername, discussionContent, parentId = null) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!discussionContent || discussionContent.trim().length === 0) {
        throw new Error("Content: invalid!");
    }
    if (discussionContent.length > 2000) {
        throw new Error("Content: too long!");
    }

    const f = await fileFunctions.getFile(fileId);
    if (!f) {
        throw new Error("FID: 404!");
    }

    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }

    let parentIdObj = null;
    if (parentId) {
        try {
            parentIdObj = service.makeObjectId(parentId);
        } catch (error) {
            throw new Error("Parent ID: invalid format!");
        }

        const parentDiscussion = await discussionModel.findOne({ _id: parentIdObj });
        if (!parentDiscussion) {
            throw new Error("Parent discussion: 404!");
        }

        if (!parentDiscussion.fileID.equals(f._id)) {
            throw new Error("Parent discussion: belongs to different file!");
        }
    }

    try {
        const newDiscussion = new discussionModel({
            fileID: f._id,
            userID: u._id,
            parentID: parentIdObj,
            content: discussionContent.trim(),
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return await newDiscussion.save();
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}


async function getDiscussionsByFile(fileId) {
    if (!fileId) {
        throw new Error("FID: invalid!");
    }

    const f = await fileFunctions.getFile(fileId);
    if (!f) {
        throw new Error("FID: 404!");
    }

    try {
        const discussions = await discussionModel
            .find({ fileID: f._id })
            .populate('userID', 'username profile')
            .sort({ createdAt: -1 })
            .lean();

        const discussionMap = {};
        const rootDiscussions = [];

        discussions.forEach(discussion => {
            discussion.replies = [];
            discussion.likeCount = discussion.likes.length;
            discussionMap[discussion._id.toString()] = discussion;
        });

        discussions.forEach(discussion => {
            if (discussion.parentID) {
                const parentId = discussion.parentID.toString();
                if (discussionMap[parentId]) {
                    discussionMap[parentId].replies.push(discussion);
                }
            } else {
                rootDiscussions.push(discussion);
            }
        });

        Object.values(discussionMap).forEach(discussion => {
            discussion.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });

        return rootDiscussions;
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}


async function getDiscussion(discussionId) {
    if (!discussionId) {
        throw new Error("DID: invalid!");
    }

    let discussionIdObj;
    try {
        discussionIdObj = service.makeObjectId(discussionId);
    } catch (error) {
        throw new Error("DID: invalid format!");
    }

    try {
        const discussion = await discussionModel
            .findOne({ _id: discussionIdObj })
            .populate('userID', 'username profile');

        if (!discussion) {
            throw new Error("DID: 404!");
        }

        return discussion;
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}


async function editDiscussion(discussionId, desiredUsername, newContent) {
    if (!discussionId) {
        throw new Error("DID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }
    if (!newContent || newContent.trim().length === 0) {
        throw new Error("Content: invalid!");
    }
    if (newContent.length > 2000) {
        throw new Error("Content: too long!");
    }

    let discussionIdObj;
    try {
        discussionIdObj = service.makeObjectId(discussionId);
    } catch (error) {
        throw new Error("DID: invalid format!");
    }

    const d = await discussionModel.findOne({ _id: discussionIdObj });
    if (!d) {
        throw new Error("DID: 404!");
    }

    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }

    if (!d.userID.equals(u._id) && u.type !== 'moderator') {
        throw new Error("Username: unauthorized!");
    }

    try {
        return await discussionModel.findByIdAndUpdate(
            discussionIdObj,
            {
                content: newContent.trim(),
                updatedAt: new Date()
            },
            { new: true }
        ).populate('userID', 'username profile');
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}


async function deleteDiscussion(discussionId, desiredUsername) {
    if (!discussionId) {
        throw new Error("DID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }

    let discussionIdObj;
    try {
        discussionIdObj = service.makeObjectId(discussionId);
    } catch (error) {
        throw new Error("DID: invalid format!");
    }

    const d = await discussionModel.findOne({ _id: discussionIdObj });
    if (!d) {
        throw new Error("DID: 404!");
    }

    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }

    if (!d.userID.equals(u._id) && u.type !== 'moderator') {
        throw new Error("Username: unauthorized!");
    }

    try {
        await discussionModel.deleteMany({ parentID: discussionIdObj });

        return await discussionModel.findByIdAndDelete(discussionIdObj);
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}


async function toggleLike(discussionId, desiredUsername) {
    if (!discussionId) {
        throw new Error("DID: invalid!");
    }
    if (!desiredUsername) {
        throw new Error("Username: invalid!");
    }

    let discussionIdObj;
    try {
        discussionIdObj = service.makeObjectId(discussionId);
    } catch (error) {
        throw new Error("DID: invalid format!");
    }

    const d = await discussionModel.findOne({ _id: discussionIdObj });
    if (!d) {
        throw new Error("DID: 404!");
    }

    const u = await userFunctions.getUser(desiredUsername);
    if (!u) {
        throw new Error("Username: 404!");
    }

    try {
        const hasLiked = d.likes.some(likeId => likeId.equals(u._id));

        if (hasLiked) {
            d.likes = d.likes.filter(likeId => !likeId.equals(u._id));
        } else {
            d.likes.push(u._id);
        }

        await d.save();

        return await discussionModel
            .findOne({ _id: discussionIdObj })
            .populate('userID', 'username profile');
    } catch (error) {
        throw new Error("Mongo: error! " + error.message);
    }
}

export default {
    addDiscussion,
    getDiscussionsByFile,
    getDiscussion,
    editDiscussion,
    deleteDiscussion,
    toggleLike
};
