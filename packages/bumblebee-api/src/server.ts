/* eslint-disable no-console */
import "regenerator-runtime/runtime.js";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "./configuration/database";
import playlists from "./controllers/playlists";

dotenv.config();

connectDB();

const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use("/api/playlists", playlists);

// Init
const port = app.get("port");
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

export default server;
