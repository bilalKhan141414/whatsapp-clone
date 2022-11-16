import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getMessages } from "../../queries/MessageQueries";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
const msgApiInitialData = {
  start: 0,
  limit: 50,
};
const updateLoop = (friends, message) => {
  var i = friends.length;
  const updatedFriends = [...friends];
  for (; i--; ) {
    if (friends[i]._id === message.from) {
      updatedFriends[i].lastMessage = message;
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
  const updateLastMessage = (message) => {
    setUserDetails((prevState) => ({
      ...prevState,
      friends: [...updateLoop(prevState.friends, message)],
    }));
  };
  const handleSetMessage = (message) => {
    setUserDetails((prevState) => ({
      ...prevState,
      friends: [...updateLoop(prevState.friends, message)],
    }));
    if (message.isReply || message.from === queryString.friend) {
      setMessages((prevstate) => [...prevstate, message]);
    }
  };

  const updateStatus = (msgIds, status) => {
    const messgaeIds = typeof msgIds === "string" ? [msgIds] : msgIds;
    setMessages((prevStatus) => [
      ...prevStatus.map((msg) => {
        if (messgaeIds.includes(msg.id)) {
          const updatedMsg = { ...msg, status };
          updateLastMessage(updatedMsg);
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
