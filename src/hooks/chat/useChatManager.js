import { useState } from "react";
import { useQuery } from "react-query";
import { getMessages } from "../../queries/MessageQueries";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
const msgApiInitialData = {
  start: 0,
  limit: 50,
};
export const useChatManager = () => {
  const [messages, setMessages] = useState([]);
  const [msgApiData, setmsgApiData] = useState(msgApiInitialData);
  const { queryString } = useQueryString();
  const { isLoading: isLoadingMessages, isFetching: isFetchingMessages } =
    useQuery(["api-messages", queryString.friend, msgApiData], getMessages, {
      onSuccess: (response) => {
        setMessages(response.data);
      },
      refetchOnWindowFocus: false,
    });
  const handleSetMessage = (message) => {
    setMessages((prevstate) => [...prevstate, message]);
  };
  const updateStatus = (msgIds, status) => {
    const messgaeIds = typeof msgIds === "string" ? [msgIds] : msgIds;
    setMessages((prevStatus) => [
      ...prevStatus.map((msg) => {
        if (messgaeIds.includes(msg.id)) {
          return { ...msg, status };
        }
        return msg;
      }),
    ]);
  };
  const resetChat = () => setMessages([]);
  return {
    loadingChatMessages: isLoadingMessages || isFetchingMessages,
    messages,
    resetChat,
    updateStatus,
    setmsgApiData,
    setMessages,
    handleSetMessage,
  };
};
