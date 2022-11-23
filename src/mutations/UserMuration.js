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
      const loginUserId = localStorageHelpers.User.id;
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

export const getMessagesByChatIds = (payload) => {
  return axios
    .get("api/chat", {
      params: {
        ...payload,
      },
    })
    .then((resp) => {
      const { data } = resp.data;
      if (data?.length > 0) {
        return {
          messages: data,
          ...payload,
        };
      }
      return {
        messages: [],
        ...payload,
        isDone: true,
      };
    });
};
