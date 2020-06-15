import axios from "axios";
import config from "../config";
import Song from "models/song";
import ytdl from "ytdl-core";
import { Readable } from "stream";
import { StreamingPlatform } from "commands/voice-commands/voice-commands";

abstract class YoutubeService {
  private static _youtubeSearchUrl =
    "https://www.googleapis.com/youtube/v3/search";

  public static async searchVideo(query: string): Promise<Song> {
    const videos = await axios.get(this._youtubeSearchUrl, {
      params: {
        key: config.ytkey,
        part: "snippet",
        q: query,
        topicId: "/m/04rlf",
        type: "video",
      },
    });

    const video = videos.data.items[0];
    const id = video.id.videoId;
    const title = video.snippet.title;

    return {
      id,
      title,
      source: StreamingPlatform.Youtube,
    };
  }

  public static getVideoAudio(id: string): Readable {
    return ytdl(`https://www.youtube.com/watch?v=${id}`, {
      quality: "highestaudio",
      filter: "audioonly",
    });
  }
}

export default YoutubeService;
