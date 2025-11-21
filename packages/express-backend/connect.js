import { MongoClient as mongo } from 'mongodb';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("debug", true);

let connection;
let data;
let users;
let files;
let reviews;

async function setDB(type) {
    if (type) {
        await mongoose.connect(process.env.MONDODB_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        }).catch((error) => console.log(error));
    }
    else {
        connection = await mongo.connect(global.__MONGO_URI__, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        }).catch((error) => console.log(error));
        data = connection.db();
        users = datab.collection('webusers');
        files = datab.collection('files');
        reviews = db.collection('reviews');
    }
}

async function destroyDB() {
    await connection.close();
}

export default { setDB, destroyDB };