/* eslint-disable no-console */
import "regenerator-runtime/runtime.js";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "configuration/database";
import playlists from "controllers/playlists";
import auth from "controllers/auth";
import users from "controllers/users";
import useDiscordStategy from "./strategies/discord";
import passport from "passport";
import cors from "cors";
import { checkAuthentication } from "configuration/authUtils";

dotenv.config();
connectDB();
useDiscordStategy();

const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.use("/playlists", checkAuthentication, playlists);
app.use("/users", checkAuthentication, users);
app.use("/auth", auth);

// Init
const port = app.get("port");
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

export default server;
