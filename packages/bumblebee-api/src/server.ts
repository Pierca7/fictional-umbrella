/* eslint-disable no-console */
import "regenerator-runtime/runtime.js";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "./configuration/database";
import playlists from "./controllers/playlists";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/playlists", playlists);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`),
);

export default server;
