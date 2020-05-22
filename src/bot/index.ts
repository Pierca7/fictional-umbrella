import * as Commando from "discord.js-commando";
import config from "../../config";

const { owner, token } = config;

const client = new Commando.CommandoClient({
  commandPrefix: "--",
  owner: owner,
});

client.login(token);
