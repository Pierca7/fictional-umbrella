import { Schema, Model, Document, model } from "mongoose";
import { UserDTO } from "../data-objects/user";

export interface IUser extends Document, UserDTO {}

const UserSchema: Schema = new Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
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
})

export const User: Model<IUser> = model("User", UserSchema);