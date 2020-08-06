import SpotifyService from "../services/spotify/spotify-service";
import YoutubeService from "../services/youtube/youtube-service";
import PlaylistManager from "../data-access/playlists";
import { SpotifyPlaylist } from "services/spotify/models/playlist";

export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface Song {
  length: number;
  name: string;
  originUrl: string;
  thumbnail: string;
  url: string;
}

export interface Source {
  readonly provider: Providers;
  readonly url: string;
}

export interface NewPlaylist {
  length: number;
  name: string;
  owner: string;
  thumbnail: string;
  sources: Array<Source>;
  songs: Array<Song>;
  lastUpdated: string;
}

export interface Playlist extends NewPlaylist {
  readonly id: string;
}

const parseLength = (string: string): number => {
  if (!string) {
    return Infinity;
  }

  const parsedLength = string.split(":");

  if (parsedLength.length < 2) {
    return Infinity;
  }

  return parseInt(parsedLength[0], 10) * 60 + parseInt(parsedLength[1], 10);
};

export class PlaylistFactory {
  public static async createFromSpotify(url: string, owner: string, name?: string): Promise<Playlist> {
    const spotifyPlaylistId = url.split("/").pop();
    const spotifyPlaylist = await SpotifyService.getPlaylist(spotifyPlaylistId);

    const songs = await this._mapSpotifySongs(spotifyPlaylist);

    const newPlaylist: NewPlaylist = {
      length: spotifyPlaylist.tracks.total,
      name: name || spotifyPlaylist.name,
      owner: owner,
      sources: [
        {
          provider: Providers.Spotify,
          url: spotifyPlaylist.href,
        },
      ],
      songs: songs,
      thumbnail: spotifyPlaylist.images[0].url,
      lastUpdated: new Date().toISOString(),
    };

    const playlistDocument = await PlaylistManager.create(newPlaylist);

    return {
      id: playlistDocument._id,
      ...newPlaylist,
    };
  }

  private static async _mapSpotifySongs(spotifyPlaylist: SpotifyPlaylist): Promise<Array<Song>> {
    const songPromises = spotifyPlaylist.tracks.items.map(async item => {
      const artistNames = item.track.artists.map(artist => artist.name).join(" ");
      const query = `${item.track.name} ${artistNames}`;

      const video = await YoutubeService.searchVideo(query);

      return {
        ...video[0],
        originUrl: item.track.href,
        originArtists: item.track.artists,
        originThumbnail: item.track.album.images[0].url,
      };
    });

    const possibleSongs = await Promise.all(songPromises);

    // Take the first of the videos returned by Youtube and map them to the common interface
    return possibleSongs.map(
      video =>
        ({
          length: parseLength(video.duration),
          name: video.title,
          thumbnail: video.originThumbnail,
          url: video.link,
          originUrl: video.originUrl,
        } as Song)
    );
  }
}
