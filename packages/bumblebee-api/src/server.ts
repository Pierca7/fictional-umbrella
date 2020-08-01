/* eslint-disable no-console */
import "regenerator-runtime/runtime.js";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "configuration/database";
import playlists from "controllers/playlists";
import auth from "controllers/auth";
import user from "controllers/user";
import useDiscordStategy from "./strategies/discord";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";

const Store = require("connect-mongo")(session);

dotenv.config();
connectDB();
useDiscordStategy();

const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.use("/playlists", playlists);
app.use("/user", user);
app.use("/auth", auth);

// Init
const port = app.get("port");
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

export default server;
