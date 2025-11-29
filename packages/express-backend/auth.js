import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from "./user-services.js";
import dotenv from 'dotenv';


export function registerUser(req, res) {
  const { username, pwd } = req.body; // from form in frontend

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else if (userServices.getUser(username) !== null) {
    console.log(userServices.getUser(username));
    res.status(409).send("Username already taken");
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(pwd, salt))
      .then((hashedPassword) => {
        generateAccessToken(username).then((token) => {
          console.log("Token:", token);
          res.status(201).send({ token: token });
          userServices.createUser(username, hashedPassword);
        });
      });
  }
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (decoded) {
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}

export function loginUser(req, res) {
  const { username, pwd } = req.body; // from form
  const retrievedUser = userServices.getUser(
    (c) => c.username === username
  );

  if (!retrievedUser) {
    // invalid username
    res.status(401).send("Unauthorized invalid username");
  } else {
    bcrypt
      .compare(pwd, retrievedUser.hashedPassword)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })
      .catch(() => {
        res.status(401).send("Unauthorized");
      });
  }
}

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

