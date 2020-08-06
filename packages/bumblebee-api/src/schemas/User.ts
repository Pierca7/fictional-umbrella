import { Schema, Model, Document, model } from "mongoose";
import { NewUser } from "../data-objects/user";

export interface UserDocument extends Document, NewUser {}

const UserSchema: Schema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  discordTag: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  guilds: {
    type: Array,
    required: true,
  },
});

export const UserModel: Model<UserDocument> = model("User", UserSchema);
