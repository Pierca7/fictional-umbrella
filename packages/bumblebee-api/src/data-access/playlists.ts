import PlaylistModel, { PlaylistDocument, SongModel, SourceModel } from "../schemas/Playlist";
import DataAccess from "./data-access";
import { Playlist, NewPlaylist } from "../data-objects/playlist";

abstract class PlaylistManager extends DataAccess<Playlist, PlaylistDocument> {
  public static async create(data: NewPlaylist): Promise<PlaylistDocument> {
    const playlist = new PlaylistModel({
      ...data,
      songs: data.songs.map(song => new SongModel(song)),
      sources: data.sources.map(source => new SourceModel(source)),
    });

    await playlist.save();

    return playlist;
  }

  public static async deleteById(id: string, userId: string): Promise<void> {
    PlaylistModel.remove((item: PlaylistDocument) => item && item._id === id && item.owner === userId);
  }

  public static async deleteWhere(condition: (value: PlaylistDocument) => boolean, userId: string): Promise<void> {
    await PlaylistModel.remove((item: PlaylistDocument) => item && condition(item) && item.owner === userId);
  }

  public static async getAll(userId: string): Promise<PlaylistDocument[]> {
    return await PlaylistModel.find((item: PlaylistDocument) => item && item.owner === userId);
  }

  public static async getById(id: string, userId: string): Promise<PlaylistDocument> {
    return PlaylistModel.findOne((item: PlaylistDocument) => item && item._id === id && item.owner === userId);
  }

  public static async getWhere(condition: (value: PlaylistDocument) => boolean, userId: string) {
    return PlaylistModel.find((item: PlaylistDocument) => item && condition(item) && item.owner === userId);
  }

  public static async updateById(id: string, data: Playlist, userId: string): Promise<PlaylistDocument> {
    return new Promise(async (resolve, reject) => {
      const playlist = await PlaylistModel.findOne((item: PlaylistDocument) => item && item._id === id && item.owner === userId);

      if (!playlist) {
        reject(new Error("There is no playlist matching such ID."));
      }

      playlist.name = data.name;
      playlist.length = data.length;
      playlist.songs = data.songs.map(song => new SongModel(song));
      playlist.sources = data.sources.map(source => new SourceModel(source));

      await playlist.save();

      resolve(playlist);
    });
  }
}

export default PlaylistManager;
