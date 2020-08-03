import { Document, Model, model, Schema, Types } from "mongoose";
import { SongDTO, Providers, PlaylistDTO } from "../data-objects/playlist";

export interface ISong extends SongDTO, Document {}

export interface IPlaylist extends Document, PlaylistDTO {
  songs: Array<ISong>;
}

const SongSchema: Schema = new Schema({
  length: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  originUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const PlaylistSchema: Schema = new Schema({
  length: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    enum: Object.values(Providers),
  },
  songs: [SongSchema],
  thumbnail: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Playlist: Model<IPlaylist> = model("Playlist", PlaylistSchema);
export const Song: Model<ISong> = model("Song", SongSchema);

export default Playlist;
