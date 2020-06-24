import { Document, Model, model, Schema } from "mongoose";

export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface IPlaylist extends Document {
  name: string;
  provider: Providers;
  url: string;
}

const PlaylistSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    enum: Object.values(Providers),
  },
  url: {
    type: String,
    required: true,
  },
});

const Playlist: Model<IPlaylist> = model("Playlist", PlaylistSchema);

export default Playlist;
