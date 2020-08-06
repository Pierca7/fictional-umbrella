import EYoutubeContentType from "./EContentType";
import YoutubeAuthor from "./Author";

interface YoutubeMovie {
  readonly type: EYoutubeContentType.Movie;
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: YoutubeAuthor;
  readonly description: string;
  readonly meta: ReadonlyArray<string>;
  readonly duration: number;
  readonly director: string;
  readonly actors: ReadonlyArray<string>;
}

export default YoutubeMovie;
