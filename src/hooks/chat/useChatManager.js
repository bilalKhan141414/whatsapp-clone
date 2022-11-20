import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MESSAGE_STATUS } from "../../constants/events.constant";
import { getMessages } from "../../queries/MessageQueries";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
const msgApiInitialData = {
  start: 0,
  limit: 50,
};
const updateUnSeenCount = (lastMessage, status) => {
  const { totalUnSeen } = lastMessage;
  if (status === MESSAGE_STATUS.SEEN) {
    totalUnSeen >= 1 && lastMessage.totalUnSeen--;
    return lastMessage;
  }

  lastMessage.totalUnSeen++;
  return lastMessage;
};
const updateLoop = (friends, message, status) => {
  var i = friends.length;
  const updatedFriends = [...friends];
  for (; i--; ) {
    if (updatedFriends[i].chatIds.includes(message?.chatId)) {
      //update last message unseen message count if user is not SENDING reply
      if (message && !message.isReply) {
        updatedFriends[i].lastMessage = updateUnSeenCount(
          { ...updatedFriends[i].lastMessage },
          message.status
        );
      }
      // if only message seen|un-seen status is updating then no need to update last Message
      if (status && updatedFriends[i]?.lastMessage?.id !== message.id) {
        return updatedFriends;
      }
      const { totalUnSeen } = updatedFriends[i].lastMessage;
      updatedFriends[i].lastMessage = { ...message, totalUnSeen };
      return updatedFriends;
    }
  }
  return updatedFriends;
};
export const useChatManager = (user) => {
  const [messages, setMessages] = useState([]);
  const [msgApiData, setmsgApiData] = useState(msgApiInitialData);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const { queryString } = useQueryString();

  const { isLoading: isLoadingMessages, isFetching: isFetchingMessages } =
    useQuery(["api-messages", queryString.friend, msgApiData], getMessages, {
      onSuccess: (response) => {
        setMessages(response.data);
      },
      refetchOnWindowFocus: false,
    });
  const updateLastMessage = (message, status) => {
    setUserDetails((prevState) => ({
      ...prevState,
      friends: [...updateLoop(prevState.friends, message, status)],
    }));
  };
  const handleSetMessage = (message) => {
    if (message.isReply || message.from === queryString.friend) {
      setMessages((prevstate) => [...prevstate, message]);
    }
    updateLastMessage(message);
  };

  const updateStatus = (msgIds, status) => {
    const messgaeIds = typeof msgIds === "string" ? [msgIds] : msgIds;
    setMessages((prevStatus) => [
      ...prevStatus.map((msg) => {
        if (messgaeIds.includes(msg.id)) {
          const updatedMsg = { ...msg, status };
          updateLastMessage(updatedMsg, status);
          return updatedMsg;
        }
        return msg;
      }),
    ]);
  };

  const resetChat = () => setMessages([]);
  return {
    userDetails,
    loadingChatMessages: isLoadingMessages || isFetchingMessages,
    messages,
    resetChat,
    updateStatus,
    setmsgApiData,
    setMessages,
    updateLastMessage,
    handleSetMessage,
  };
};
