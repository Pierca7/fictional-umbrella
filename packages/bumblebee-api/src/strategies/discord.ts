import passport from "passport";
import DiscordStrategy from "passport-discord";
import { UserModel, UserDocument } from "../schemas/User";
import UserManager from "../data-access/users";

const useDiscordStategy = () => {
  passport.serializeUser((user: UserDocument, done) => {
    return done(null, user.discordId);
  });

  passport.deserializeUser(async (discordId, done) => {
    try {
      const user = await UserModel.findOne({
        discordId,
      });

      return user ? done(null, user) : done(null, null);
    } catch (err) {
      return done(err, null);
    }
  });

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/discord/redirect",
        scope: ["identify", "guilds"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, avatar, discriminator, guilds, username } = profile;

          const user = await UserManager.createOrUpdateUser({
            avatar: avatar,
            discordId: id,
            discordTag: `${username}#${discriminator}`,
            guilds: guilds,
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

export default useDiscordStategy;
