import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import userServices from "./user-services.js";
import fileServices from "./file-services.js";
import reviewServices from "./review-services.js";
import discussionServices from "./discussion-services.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined at runtime");
}

mongoose.set("debug", true);

let gridFSBucket;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    if (mongoose.connection.db) {
      try {
        gridFSBucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: 'files'
        });
        console.log('GridFS bucket initialized successfully');
      } catch (error) {
        console.error('Failed to initialize GridFS bucket:', error);
      }
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const findUserById = (_id) => userServices.findUserById(_id);

const getUsers = (name, job) => userServices.getUsers(name, job);

const deleteByID = (_id) => userServices.deleteByID(_id);

const findFiles = (query, mediaTypes, tags) =>
  fileServices.findFiles(query, mediaTypes, tags);

const getAllTags = () => fileServices.getAllTags();

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
  let tags = req.query.tags;

  if (typeof mediaTypes === "string") {
    mediaTypes = mediaTypes.split(",");
  }

  if (typeof tags === "string") {
    tags = tags.split(",");
  }

  findFiles(query, mediaTypes, tags)
    .then((files) => res.status(200).send(files))
    .catch(() => res.status(500).send("Internal Server Error."));
});

app.get("/tags", (req, res) => {
  getAllTags()
    .then((tags) => res.status(200).send(tags))
    .catch(() => res.status(500).send("Internal Server Error."));
});

app.get("/files/:id", (req, res) => {
  const fileId = req.params.id;
  fileServices.getFile(fileId)
    .then((file) => {
      if (!file) {
        res.status(404).send("File not found.");
      } else {
        res.status(200).send(file);
      }
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error: " + error.message);
    });
});

app.get("/files/:id/download", (req, res) => {
  const fileId = req.params.id;

  fileServices.getFile(fileId)
    .then((file) => {
      if (!file) {
        console.error(`File download error: File not found for ID ${fileId}`);
        return res.status(404).send("File not found.");
      }

      if (!file.gridfsId) {
        console.log(`File ${fileId} has no gridfsId, using external link`);
        return res.status(404).send("File content not available in database. Use external link.");
      }

      if (!gridFSBucket) {
        console.error("GridFS bucket not initialized");
        return res.status(500).send("GridFS not initialized");
      }

      console.log(`Attempting to download file ${fileId} with gridfsId ${file.gridfsId}`);

      res.set({
        'Content-Type': file.filetype === 'pdf' ? 'application/pdf' : 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.title}"`,
      });

      const downloadStream = gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(file.gridfsId));

      downloadStream.on('error', (error) => {
        console.error('GridFS download error for file', fileId, 'with gridfsId', file.gridfsId, ':', error);
        if (!res.headersSent) {
          res.status(404).send("File content not found in database.");
        }
      });

      downloadStream.pipe(res);
    })
    .catch((error) => {
      console.error(`File download error for ${fileId}:`, error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    });
});

app.get("/files/:id/thumbnail", async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await fileServices.getFile(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (!file.gridfsId) {
      return res.status(404).send("File content not available");
    }

    if (!gridFSBucket) {
      return res.status(500).send("GridFS not initialized");
    }

    const downloadStream = gridFSBucket.openDownloadStream(
      new mongoose.Types.ObjectId(file.gridfsId)
    );

    const chunks = [];

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(pdfBuffer),
          useSystemFonts: true,
          standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/',
        });

        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(1);

        const viewport = page.getViewport({ scale: 1.0 });
        const scale = 200 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = createCanvas(scaledViewport.width, scaledViewport.height);
        const context = canvas.getContext('2d');

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;

        const pngBuffer = canvas.toBuffer('image/png');

        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(pngBuffer);

      } catch (renderError) {
        console.error('Error rendering PDF thumbnail:', renderError);
        if (!res.headersSent) {
          const titleText = (file.title || "Untitled").substring(0, 30);
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280">
            <rect width="200" height="280" fill="#dc3545"/>
            <rect x="10" y="10" width="180" height="260" fill="#fff" stroke="#000" stroke-width="2"/>
            <text x="100" y="50" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#dc3545">PDF Error</text>
            <text x="100" y="140" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#666">
              <tspan x="100" dy="0">${titleText.substring(0, 15)}</tspan>
              ${titleText.length > 15 ? `<tspan x="100" dy="15">${titleText.substring(15, 30)}</tspan>` : ''}
            </text>
          </svg>`;
          res.set('Content-Type', 'image/svg+xml');
          res.send(svg);
        }
      }
    });

    downloadStream.on('error', (error) => {
      console.error('GridFS download error for thumbnail:', error);
      if (!res.headersSent) {
        const titleText = (file.title || "Untitled").substring(0, 30);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280">
          <rect width="200" height="280" fill="#ffc107"/>
          <rect x="10" y="10" width="180" height="260" fill="#fff" stroke="#000" stroke-width="2"/>
          <text x="100" y="50" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#ffc107">Not Downloaded</text>
          <text x="100" y="140" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#666">
            <tspan x="100" dy="0">${titleText.substring(0, 15)}</tspan>
            ${titleText.length > 15 ? `<tspan x="100" dy="15">${titleText.substring(15, 30)}</tspan>` : ''}
          </text>
        </svg>`;
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    });

  } catch (error) {
    console.error(`Thumbnail generation error for ${fileId}:`, error);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

app.get("/files/:id/reviews", (req, res) => {
  const fileId = req.params.id;
  reviewServices.getReviewsMedia(fileId)
    .then((reviews) => res.status(200).send(reviews))
    .catch((error) => {
      res.status(500).send("Internal Server Error: " + error.message);
    });
});

app.post("/files/:id/reviews", (req, res) => {
  const fileId = req.params.id;
  const { title, content, rating, username } = req.body;
  const user = username || "testuser";

  reviewServices.addReview(fileId, user, title, content, rating)
    .then((review) => res.status(201).send(review))
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else if (error.message.includes("duplicate")) {
        res.status(409).send("You have already reviewed this file.");
      } else {
        res.status(400).send(error.message);
      }
    });
});

app.put("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const { content, rating, username } = req.body;
  const user = username || "testuser";

  reviewServices.editReview(user, reviewId, content, rating)
    .then((result) => res.status(200).send(result))
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else if (error.message.includes("unauthorized")) {
        res.status(403).send("You are not authorized to edit this review.");
      } else {
        res.status(400).send(error.message);
      }
    });
});

app.delete("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const { username } = req.body;
  const user = username || "testuser";

  reviewServices.deleteReview(user, reviewId)
    .then(() => res.status(204).send())
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else if (error.message.includes("unauthorized")) {
        res.status(403).send("You are not authorized to delete this review.");
      } else {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    });
});

app.get("/files/:id/discussions", (req, res) => {
  const fileId = req.params.id;
  discussionServices.getDiscussionsByFile(fileId)
    .then((discussions) => res.status(200).send(discussions))
    .catch((error) => {
      res.status(500).send("Internal Server Error: " + error.message);
    });
});

app.post("/files/:id/discussions", authenticateUser, (req, res) => {
  const fileId = req.params.id;
  const { content, parentId } = req.body;
  const username = req.user.username;

  discussionServices.addDiscussion(fileId, username, content, parentId)
    .then((discussion) => res.status(201).send(discussion))
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else {
        res.status(400).send(error.message);
      }
    });
});

app.put("/discussions/:id", authenticateUser, (req, res) => {
  const discussionId = req.params.id;
  const { content } = req.body;
  const username = req.user.username;

  discussionServices.editDiscussion(discussionId, username, content)
    .then((discussion) => res.status(200).send(discussion))
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else if (error.message.includes("unauthorized")) {
        res.status(403).send("You are not authorized to edit this discussion.");
      } else {
        res.status(400).send(error.message);
      }
    });
});

app.delete("/discussions/:id", authenticateUser, (req, res) => {
  const discussionId = req.params.id;
  const username = req.user.username;

  discussionServices.deleteDiscussion(discussionId, username)
    .then(() => res.status(204).send())
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else if (error.message.includes("unauthorized")) {
        res.status(403).send("You are not authorized to delete this discussion.");
      } else {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    });
});

app.post("/discussions/:id/like", authenticateUser, (req, res) => {
  const discussionId = req.params.id;
  const username = req.user.username;

  discussionServices.toggleLike(discussionId, username)
    .then((discussion) => res.status(200).send(discussion))
    .catch((error) => {
      if (error.message.includes("404")) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    });
});

app.listen(port, () => {
  console.log("REST API is listening.");
});
