import EContentType from "./EContentType";
import Author from "./Author";

interface Video {
  readonly type: EContentType.Video;
  readonly live: boolean;
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: Author;
  readonly description: string;
  readonly views?: number;
  readonly duration?: string;
  readonly uploaded_at?: string;
}

export default Video;
