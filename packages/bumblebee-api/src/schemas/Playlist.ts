import { Document, Model, model, Schema } from "mongoose";
import { SongDTO, Providers, PlaylistDTO } from "../data-objects/playlist";

export interface ISong extends SongDTO, Document {}

export interface IPlaylist extends Document, PlaylistDTO {
  songs: Array<ISong>;
}

const SongSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
});

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
  songs: [SongSchema],
  length: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Playlist: Model<IPlaylist> = model("Playlist", PlaylistSchema);
export const Song: Model<ISong> = model("Song", SongSchema);

export default Playlist;
