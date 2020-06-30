import Movie from "./models/Movie";
import Channel from "./models/Channel";
import Mix from "./models/Mix";
import Video from "./models/Video";
import Playlist from "./models/Playlist";
import { EContentTypeFilter } from "./models/EContentType";

const ytsr = require("ytsr");

export type YoutubeContentArray = Array<
  Movie | Channel | Mix | Video | Playlist
>;

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
  public static async searchVideo(query: string): Promise<Video[]> {
    return this._search(query, EContentTypeFilter.Video) as Promise<Video[]>;
  }

  public static async searchPlaylist(query: string): Promise<Playlist[]> {
    return this._search(query, EContentTypeFilter.Playlist) as Promise<
      Playlist[]
    >;
  }

  private static async _search(
    query: string,
    type: EContentTypeFilter,
    limit: number = 5,
  ): Promise<YoutubeContentArray> {
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
