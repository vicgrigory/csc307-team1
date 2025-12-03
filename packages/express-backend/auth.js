import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from "./user-services.js";
import dotenv from 'dotenv';


export async function registerUser(req, res) {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  let existingUser = null;

  try {
    existingUser = await userServices.getUser(username); // <-- MUST await
  } catch (err) {
    existingUser = null;
  }

  if (existingUser) {
    return res.status(409).send("Username already taken");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    const token = await generateAccessToken(username);

    // respond BEFORE creating user, just like your logic wants
    res.status(201).send({ token });

    await userServices.createUser(username, hashedPassword);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (decoded) {
          req.user = decoded;
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}

export async function loginUser(req, res) {
  const { username, pwd } = req.body;

  let retrievedUser = null;

  try {
    retrievedUser = await userServices.getUser(username);
  } catch (err) {
    return res.status(401).send("Unauthorized invalid username");
  }

  if (!retrievedUser) {
    return res.status(401).send("Unauthorized invalid username");
  }

  const matched = await bcrypt.compare(pwd, retrievedUser.hashedPassword);

  if (!matched) {
    return res.status(401).send("Unauthorized");
  }

  const token = await generateAccessToken(username);
  res.status(200).send({ token });
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

