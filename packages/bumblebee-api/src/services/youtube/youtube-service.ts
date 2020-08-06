import YoutubeMovie from "./models/Movie";
import YoutubeChannel from "./models/Channel";
import YoutubeMix from "./models/Mix";
import YoutubeVideo from "./models/Video";
import YoutubePlaylist from "./models/Playlist";
import { EYoutubeContentTypeFilter } from "./models/EContentType";

const ytsr = require("ytsr");

export type YoutubeContentArray = Array<YoutubeMovie | YoutubeChannel | YoutubeMix | YoutubeVideo | YoutubePlaylist>;

export interface Filter {
  readonly ref?: string;
  readonly name: string;
  readonly active: boolean;
}
export interface SearchOptions {
  safeSearch: boolean;
  limit: number;
  nextpageRef?: string;
}

export interface SearchResult {
  readonly query: string;
  readonly items: YoutubeContentArray;
  readonly nextpageRef: string;
  readonly results: number;
  readonly filters: ReadonlyArray<Filter>;
  readonly currentRef?: string;
}

abstract class YoutubeService {
  public static async searchVideo(query: string): Promise<YoutubeVideo[]> {
    return this._search(query, EYoutubeContentTypeFilter.Video) as Promise<YoutubeVideo[]>;
  }

  public static async searchPlaylist(query: string): Promise<YoutubePlaylist[]> {
    return this._search(query, EYoutubeContentTypeFilter.Playlist) as Promise<YoutubePlaylist[]>;
  }

  private static async _search(query: string, type: EYoutubeContentTypeFilter, limit: number = 5): Promise<YoutubeContentArray> {
    return new Promise((resolve, reject) => {
      let filter: Filter;

      ytsr.getFilters(query, (err: Error, filters: any) => {
        if (err) {
          reject(err);
        }

        filter = filters.get("Type").find((o: any) => o.name === type);
        const options: SearchOptions = {
          safeSearch: false,
          limit: limit,
          nextpageRef: filter.ref,
        };

        ytsr(null, options, (err2: Error, searchResults: SearchResult) => {
          if (err2) {
            reject(err2);
          }

          resolve(searchResults.items);
        });
      });
    });
  }
}

export default YoutubeService;
