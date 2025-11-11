// jest.env.js
import dotenv from "dotenv";

// Make sure CI env vars aren't lost
dotenv.config({ override: false });

console.log("🧪 Jest setup: MONGODB_URI is", process.env.MONGODB_URI ? "defined" : "undefined");
