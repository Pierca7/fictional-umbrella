import axios from "axios";

export const getUserDetails = async (): Promise<any> =>
  axios
    .get("http://localhost:5000/user", {
      headers: {
        "x-access-token": localStorage.getItem("x-access-token"),
      },
    })
    .then(res => res.data)
    .catch(() => {});
