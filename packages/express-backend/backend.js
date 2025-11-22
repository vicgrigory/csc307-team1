import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userServices from "./user-services.js";
import fileServices from "./file-services.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, ".env"),
  override: false,
});

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined at runtime");
}

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

const findUserById = (_id) => userServices.findUserById(_id);

const addUser = (user) => userServices.addUser(user);

const getUsers = (name, job) => userServices.getUsers(name, job);

const findUserByName = (name) => userServices.findUserByName(name);

const deleteByID = (_id) => userServices.deleteByID(_id);

const findFiles = (query, mediaTypes) =>
  fileServices.findFiles(query, mediaTypes);

app.get("/users/:id", (req, res) => {
  const _id = req.params["_id"];
  findUserById(_id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error.");
    });
});

app.delete("/users", (req, res) => {
  deleteByID(req.body._id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send("Internal Server Error: " + err));
});

app.get("/users", (req, res) => {
  getUsers(req.query.name, req.query.job)
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send("Internal Server Error: " + err));
});

app.get("/search", (req, res) => {
  const query = req.query.q;
  let mediaTypes = req.query.mediaTypes;
  if (typeof mediaTypes === "string") {
    mediaTypes = mediaTypes.split(",");
  }

  findFiles(query, mediaTypes)
    .then((files) => res.status(200).send(files))
    .catch((err) => res.status(500).send("Internal Server Error: " + err));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
