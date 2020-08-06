import { Document, Model, model, Schema } from "mongoose";
import { Providers, Song, NewPlaylist, Source } from "../data-objects/playlist";

export interface SongDocument extends Document, Song {}

export interface SourceDocument extends Document, Source {}

export interface PlaylistDocument extends Document, NewPlaylist {
  songs: Array<SongDocument>;
  sources: Array<SourceDocument>;
}

const SourceSchema: Schema = new Schema({
  provider: {
    type: String,
    required: true,
    enum: ["youtube", "spotify"],
  },
  url: {
    type: String,
    required: true,
  },
});

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
  lastUpdated: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  songs: [SongSchema],
  sources: [SourceSchema],
  thumbnail: {
    type: String,
    required: true,
  },
});

const PlaylistModel: Model<PlaylistDocument> = model("Playlist", PlaylistSchema);
export const SongModel: Model<SongDocument> = model("Song", SongSchema);
export const SourceModel: Model<SourceDocument> = model("Source", SourceSchema);

export default PlaylistModel;
