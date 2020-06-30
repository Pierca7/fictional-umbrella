import EContentType from "./EContentType";

interface Channel {
  readonly type: EContentType.Channel;
  readonly channel_id: string;
  readonly name: string;
  readonly link: string;
  readonly avatar: string;
  readonly verified: boolean;
  readonly followers: number;
  readonly description_short: string;
  readonly videos: number;
}

export default Channel;
