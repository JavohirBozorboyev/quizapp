import axios from "axios";
import { getCookie } from "cookies-next";

export const TokenFetcher = async (url: string) => {
  let token = getCookie("token");
  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data);
};
