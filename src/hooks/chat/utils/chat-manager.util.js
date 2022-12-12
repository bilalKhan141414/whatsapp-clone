import { MESSAGE_STATUS } from "../../../constants/events.constant";

export const updateUnSeenCount = (lastMessage, status) => {
  const { totalUnSeen } = lastMessage;
  if (status === MESSAGE_STATUS.SEEN) {
    totalUnSeen >= 1 && lastMessage.totalUnSeen--;
    return lastMessage;
  }

  lastMessage.totalUnSeen++;
  return lastMessage;
};
export const updateLoop = (friends, message) => {
  var i = friends.length;
  const updatedFriends = [...friends];
  for (; i--; ) {
    if (updatedFriends[i].chatIds.includes(message?.chatId)) {
      if (!updatedFriends[i].lastMessage) {
        updatedFriends[i].lastMessage = { ...message };
      }
      //Response
      //update ONLY last message unseen message count if user is not SENDING reply
      if (message && !message.isReply) {
        updatedFriends[i].lastMessage = updateUnSeenCount(
          { ...updatedFriends[i].lastMessage },
          message.status
        );
      }

      //Reply
      // update the last message of selected user
      const { totalUnSeen } = updatedFriends[i].lastMessage;
      updatedFriends[i].lastMessage = { ...message, totalUnSeen };
      return updatedFriends;
    }
  }
  return updatedFriends;
};
