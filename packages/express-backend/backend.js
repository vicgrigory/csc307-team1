import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userServices from "./user-services.js";
import fileServices from "./file-services.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";

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

const getUsers = (name, job) => userServices.getUsers(name, job);

const deleteByID = (_id) => userServices.deleteByID(_id);

const findFiles = (query, mediaTypes) =>
  fileServices.findFiles(query, mediaTypes);

app.post("/login", loginUser);

app.post("/signup", registerUser);

app.get("/users/:id", authenticateUser, (req, res) => {
  const _id = req.params.id;
  findUserById(_id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch(() => {
      res.status(500).send("Internal Server Error.");
    });
});

app.delete("/users", authenticateUser, (req, res) => {
  deleteByID(req.body._id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch(() => {
      res.status(500).send("Internal Server Error.");
    });
});

app.get("/users", authenticateUser, (req, res) => {
  getUsers(req.query.name, req.query.job)
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send("Internal Server Error."));
});

app.get("/search", (req, res) => {
  const query = req.query.q;
  let mediaTypes = req.query.mediaTypes;
  if (typeof mediaTypes === "string") {
    mediaTypes = mediaTypes.split(",");
  }

  findFiles(query, mediaTypes)
    .then((files) => res.status(200).send(files))
    .catch(() => res.status(500).send("Internal Server Error."));
});

app.listen(port, () => {
  console.log("REST API is listening.");
});
