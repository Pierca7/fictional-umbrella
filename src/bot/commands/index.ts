/* eslint-disable no-console */
import configuration from "bot/configuration";
import { Message, Client } from "discord.js";
import hear from "commands/hear";
import deaf from "commands/deaf";

enum Commands {
  Hear = "hear",
  Deaf = "deaf",
}

const isCommand = (message: Message): boolean =>
  ((message || {}).content || "").startsWith(configuration.preffix);

const executeCommand = async (message: Message): Promise<void> => {
  const splitedMessage = message.content.split(" ");
  const command = ((splitedMessage || [])[0] || "")
    .replace(configuration.preffix, "")
    .toLowerCase();

  switch (command) {
    default:
      return;
    case Commands.Hear:
      hear(message);
      break;
    case Commands.Deaf:
      deaf(message);
      break;
  }
};

const waitForCommands = (client: Client) => {
  client.on("message", async message => {
    if (!isCommand(message)) {
      return;
    }

    await executeCommand(message);
  });
};

export default waitForCommands;
