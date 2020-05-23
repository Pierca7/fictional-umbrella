import { Client } from "discord.js";
import config from "../../config";

const { token } = config;

const client = new Client();

client.login(token);

// eslint-disable-next-line no-console
console.log("Your bot is up and running!");
