import { Message, VoiceConnection } from "discord.js";

const onlyGuildsMessage = "This command only works in guilds.";
const notInVoiceChannelMessage = "You need to join a voice channel first!";

const replyAndReject = (
  message: Message,
  callback: Function,
  text: string,
): void => {
  message.reply(text);
  callback(text);
};

export const joinVoiceChannel = async (
  message: Message,
): Promise<VoiceConnection> =>
  new Promise(async (resolve, reject) => {
    // Voice only works in guilds.
    if (!message.guild) {
      replyAndReject(message, reject, onlyGuildsMessage);
    }

    // Only try to join the sender's voice channel if they are in one themselves.
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();

      resolve(connection);
    } else {
      replyAndReject(message, reject, notInVoiceChannelMessage);
    }
  });
