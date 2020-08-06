import EYoutubeContentType from "./EContentType";
import YoutubeAuthor from "./Author";

interface YoutubePlaylist {
  readonly type: EYoutubeContentType.Playlist;
  readonly name: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: YoutubeAuthor;
  readonly length: number;
}

export default YoutubePlaylist;
