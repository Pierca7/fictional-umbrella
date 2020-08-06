import EYoutubeContentType from "./EContentType";

interface YoutubeMix {
  readonly type: EYoutubeContentType.Mix;
  readonly title: string;
  readonly firstItem: string;
  readonly thumbnail: string;
  readonly length: number;
}

export default YoutubeMix;
