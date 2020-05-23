import { Client } from "discord.js";
import config from "../../config";

const { token } = config;

const client = new Client();

client.login(token);
