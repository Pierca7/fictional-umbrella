import axios from "axios";

export const getUserDetails = async (): Promise<any> =>
  axios
    .get("http://localhost:5000/user", {
      withCredentials: true,
    })
    .then(res => res.data);
