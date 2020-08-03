import passport from "passport";
import DiscordStrategy from "passport-discord";
import { User, IUser } from "../schemas/User";

const useDiscordStategy = () => {
  passport.serializeUser((user: IUser, done) => {
    return done(null, user.discordId);
  });

  passport.deserializeUser(async (discordId, done) => {
    try {
      const user = await User.findOne({
        discordId,
      });

      return user ? done(null, user) : done(null, null);
    } catch (err) {
      return done(err, null);
    }
  });

  passport.use(
    new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/discord/redirect",
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, avatar, discriminator, guilds, username } = profile;

        const findUser = await User.findOneAndUpdate({
          discordId: id,
        }, {
          discordTag: `${username}#${discriminator}`,
          avatar,
          guilds,
        },
        {
          new: true,
        });

        if (findUser) {
          return done(null, findUser);
        }

        const newUser = await User.create({
          discordId: id,
          discordTag: `${username}#${discriminator}`,
          avatar,
          guilds,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }),
  );
};

export default useDiscordStategy;
