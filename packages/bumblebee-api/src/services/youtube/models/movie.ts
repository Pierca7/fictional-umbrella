import EContentType from "./EContentType";
import Author from "./Author";

interface Movie {
  readonly type: EContentType.Movie;
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly author: Author;
  readonly description: string;
  readonly meta: ReadonlyArray<string>;
  readonly duration: number;
  readonly director: string;
  readonly actors: ReadonlyArray<string>;
}

export default Movie;
