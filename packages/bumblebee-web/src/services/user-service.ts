import axios from "axios";
import { User } from "../models/user";

export const getUserDetails = async (): Promise<User> =>
  axios
    .get("http://localhost:5000/users/me", {
      headers: {
        "x-access-token": localStorage.getItem("x-access-token"),
      },
    })
    .then(res => res.data)
    .catch(() => {});
