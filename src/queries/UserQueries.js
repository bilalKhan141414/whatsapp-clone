import axios from "axios";
import { localStorageHelpers } from "../shared/Helpers/general";
import { getFirstCommonItem } from "../utils/array.utils";

export const getUserDetails = () =>
  axios.get("api/user").then((resp) => {
    const user = resp.data;
    console.log(user)
    if (user?.data) {
      const friendChatIdObj = {};
      user.data.friends.forEach((friend) => {
        const chatId = getFirstCommonItem(user.data.chatIds, friend.chatIds);
        friend.chatId = chatId;
        const friendLastMessage = user.data.lastMessages.find(
          (lastMessage) => lastMessage.chatId === chatId
        );
        friendChatIdObj[friend._id] = chatId;
        friend.lastMessage = friendLastMessage;
      });
      localStorageHelpers.friendChatIds = friendChatIdObj;
    }
    return user?.data;
  });
