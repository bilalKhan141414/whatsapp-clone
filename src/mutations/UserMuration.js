import axios from "axios";
import { localStorageHelpers } from "../shared/Helpers/general";

export const searchUsers = ({ data }) =>
  axios
    .get("api/users", {
      params: {
        search: data,
      },
    })
    .then((resp) => {
      const loginUserId = localStorageHelpers.User._id;
      return {
        data: resp.data.data.filter((user) => user._id !== loginUserId),
      };
    });
export const addFriend = (data) => {
  return axios
    .post("api/user/friend/add", {
      friendId: data,
    })
    .then((resp) => resp.data);
};
