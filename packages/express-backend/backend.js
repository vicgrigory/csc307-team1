import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

const findUserById = (_id) => userServices.findUserById(_id);

const addUser = (user) => userServices.addUser(user);

const getUsers = (name, job) => userServices.getUsers(name, job);

const findUserByName = (name) => userServices.findUserByName(name);

const deleteByID = (_id) => userServices.deleteByID(_id);

app.post("/login", loginUser);

app.post("/signup", registerUser);


app.get("/users/:id", authenticateUser, (req, res) => {
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

app.get("/me", authenticateUser, async (req, res) => {
  try {
    const username = req.user.username; // coming from JWT
    const user = await userServices.getUser(username);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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
    .catch((err) => {
      res.status(500).send("Internal Server Error.");
    });
});


app.get("/users", authenticateUser, (req, res) => {
  getUsers(req.query.name, req.query.job)
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send("Internal Server Error: " + err));
});


app.listen(port, () => {
  console.log("REST API is listening.");
});
