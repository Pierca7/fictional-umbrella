import EYoutubeContentType from "./EContentType";
import YoutubeAuthor from "./Author";

interface YoutubeVideo {
  readonly type: EYoutubeContentType.Video;
  readonly live: boolean;
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: YoutubeAuthor;
  readonly description: string;
  readonly views?: number;
  readonly duration?: string;
  readonly uploaded_at?: string;
}

export default YoutubeVideo;
