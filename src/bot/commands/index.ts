/* eslint-disable no-console */
import configuration from "../configuration/configuration";
import { Message, Client } from "discord.js";

const isCommand = (message: Message): boolean =>
  message.content.startsWith(configuration.preffix);

const waitForCommands = (client: Client) => {
  client.on("message", async message => {
    if (!isCommand(message)) {
      return;
    }

    message.channel.send(`You said ${message.content}`);
  });
};

export default waitForCommands;
