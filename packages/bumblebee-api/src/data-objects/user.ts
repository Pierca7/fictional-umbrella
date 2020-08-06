export interface User extends NewUser {
  readonly id: string;
}

export interface NewUser {
  discordId: string;
  discordTag: string;
  avatar: string;
  guilds: Array<any>;
}
