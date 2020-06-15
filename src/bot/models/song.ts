import { StreamingPlatform } from "commands/voice-commands/voice-commands";

export default interface Song {
  id: string;
  title: string;
  source?: StreamingPlatform;
}
