export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface Song {
  readonly length: number;
  readonly name: string;
  readonly thumbnail: string;
  readonly url: string;
}

export interface Playlist {
  readonly id: string;
  readonly length: number;
  readonly name: string;
  readonly owner: string;
  readonly provider: Providers;
  readonly songs: Array<Song>;
  readonly thumbnail: string;
  readonly url: string;
}
