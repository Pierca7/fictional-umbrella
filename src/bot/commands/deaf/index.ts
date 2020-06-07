/* eslint-disable no-console */
import { Message } from "discord.js";
import { ws } from "../hear/index";

const deaf = async (message: Message): Promise<void> => {
  try {
    ws.send('{"eof" : 1}');
  } catch (error) {
    console.error(error);
  }
};

export default deaf;
