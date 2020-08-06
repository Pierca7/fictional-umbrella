import { NewUser, User } from "../data-objects/user";
import { UserModel, UserDocument } from "../schemas/User";

abstract class UserManager {
  public static async createOrUpdateUser(user: NewUser): Promise<UserDocument> {
    const existingUser = await UserModel.findOneAndUpdate(
      {
        discordId: user.discordId,
      },
      {
        discordTag: user.discordTag,
        avatar: user.avatar,
        guilds: user.guilds,
      },
      {
        new: true,
      }
    );

    if (existingUser) {
      return existingUser;
    }

    const newUser = await UserModel.create({
      discordId: user.discordId,
      discordTag: user.discordTag,
      avatar: user.avatar,
      guilds: user.guilds,
    });

    return newUser;
  }

  public static async getUser(id: string): Promise<UserDocument> {
    return UserModel.findById(id);
  }

  public static mapDocumentToUser(user: UserDocument): User {
    return {
      avatar: user.avatar,
      discordId: user.discordId,
      discordTag: user.discordTag,
      guilds: user.guilds,
      id: user._id,
    };
  }
}

export default UserManager;
