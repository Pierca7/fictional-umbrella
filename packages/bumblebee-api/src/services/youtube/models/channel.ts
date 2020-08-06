import EYoutubeContentType from "./EContentType";

interface YoutubeChannel {
  readonly type: EYoutubeContentType.Channel;
  readonly channel_id: string;
  readonly name: string;
  readonly link: string;
  readonly avatar: string;
  readonly verified: boolean;
  readonly followers: number;
  readonly description_short: string;
  readonly videos: number;
}

export default YoutubeChannel;
