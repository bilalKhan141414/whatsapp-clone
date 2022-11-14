import axios from "axios";

export const getMessages = ({ queryKey }) => {
  return axios
    .get("api/message", {
      params: {
        friendId: queryKey[1],
        ...queryKey[2],
      },
    })
    .then((resp) => resp.data);
};
