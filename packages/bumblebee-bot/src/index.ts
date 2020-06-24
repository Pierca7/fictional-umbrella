/* eslint-disable no-console */
import "regenerator-runtime/runtime.js";
import { Client } from "discord.js";
import waitForCommands from "commands/index";
import dotenv from "dotenv";

dotenv.config();

const client = new Client();

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  console.log("Your bot is up and running!");

  waitForCommands(client);
});

client.once("disconnect", () => {
  console.log("Your bot has been disconnected.");
});

export default client;
