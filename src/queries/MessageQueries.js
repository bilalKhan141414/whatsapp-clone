import axios from "axios";

export const getMessages = ({ data }) => {
  return axios
    .get("api/message", {
      params: {
        friendId: data[1],
        ...data[2],
      },
    })
    .then((resp) => resp.data);
};
