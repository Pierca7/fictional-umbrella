/* eslint-disable no-console */
/* eslint-disable new-cap */
import express from "express";
import config from "./config";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

const app = express();

const corsOptions = {
  origin: "*",
} as CorsOptions;

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to NodeJS + ExpressJS + MongoDB application." });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// const CLIENT_ID = config.clientId;
// const CLIENT_SECRET = config.clientSecret;
// const redirect = encodeURIComponent("http://localhost:8000/api/discord/callback");

// router.get("api/discord/login", (req, res) => {
//   res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
// });

// module.exports = router;
