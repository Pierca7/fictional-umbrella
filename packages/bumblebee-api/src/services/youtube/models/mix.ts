import EContentType from "./EContentType";

interface Mix {
  readonly type: EContentType.Mix;
  readonly title: string;
  readonly firstItem: string;
  readonly thumbnail: string;
  readonly length: number;
}

export default Mix;
