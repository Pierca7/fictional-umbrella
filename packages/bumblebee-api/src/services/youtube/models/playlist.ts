import EContentType from "./EContentType";
import Author from "./Author";

interface Playlist {
  readonly type: EContentType.Playlist;
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: Author;
  readonly length: number;
}

export default Playlist;
