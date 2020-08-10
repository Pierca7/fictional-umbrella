export interface User {
  readonly id: string;
  readonly discordId: string;
  readonly discordTag: string;
  readonly avatar: string;
  readonly guilds: Array<any>;
}
