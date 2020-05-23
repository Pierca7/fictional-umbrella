/* eslint-disable no-console */
import { Client } from "discord.js";
import config from "../../config";
import waitForCommands from "./commands";

const { token } = config;

const client = new Client();

client.login(token);

client.once("ready", () => {
  console.log("Your bot is up and running!");

  waitForCommands(client);
});

client.once("disconnect", () => {
  console.log("Your bot has been disconnected.");
});

export default client;
