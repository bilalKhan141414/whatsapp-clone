/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import useChatMutations from "./useChatMutations";
import { updateLoop } from "./utils/chat-manager.util";
const msgApiInitialData = {
  start: 0,
  limit: 50,
};
const initMessages = {
  messages: [],
  ...msgApiInitialData,
};
export const useChatManager = (user, selectedUser) => {
  const [messages, setMessages] = useState(initMessages);
  const [userDetails, setUserDetails] = useState(null);
  const messagesRef = useRef({});
  const selectedChatIdRef = useRef(null);

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const { queryString } = useQueryString();
  const { userMessages, isLoadingMessages, requestFetchMessages } =
    useChatMutations();

  useEffect(() => {
    if (selectedUser && selectedChatIdRef.current !== selectedUser.chatId) {
      const seletedUserChat = messagesRef?.current[selectedUser.chatId];
      selectedChatIdRef.current = selectedUser.chatId;
      if (seletedUserChat) {
        setMessages(seletedUserChat);
        return;
      }
      requestFetchMessages({
        chatId: selectedUser.chatId,
        ...msgApiInitialData,
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (userMessages?.messages?.length) {
      const { chatId, ...restUserMsgs } = userMessages;
      const existingChat = messagesRef.current[chatId];
      //if fisrt time chat opens
      if (!restUserMsgs.start) {
        messagesRef.current[chatId] = restUserMsgs;
        setMessages(restUserMsgs);
        return;
      }
      //else user is scrolling to view old messages
      const { start: newStart, limit: newLimit, messages } = restUserMsgs;
      const { start, limit } = existingChat;

      if (start !== newStart && limit !== newLimit) {
        setMessages((prevState) => {
          const updatedMessages = [...messages, ...prevState.messages];
          messagesRef.current[chatId] = {
            start: newStart,
            limit: newLimit,
            messages: updatedMessages,
          };
          return {
            ...prevState,
            ...messagesRef.current[chatId],
          };
        });
      }
    } else {
      if (userMessages?.isDone && messagesRef.current[userMessages?.chatId]) {
        messagesRef.current[userMessages?.chatId].isDone = true;
        setMessages((prevState) => ({
          ...prevState,
          isDone: true,
        }));
      }
    }
  }, [userMessages]);

  const updateLastMessage = (message) => {
    setUserDetails((prevState) => ({
      ...prevState,
      friends: [...updateLoop(prevState.friends, message)],
    }));
  };

  const handleSetMessage = (message) => {
    if (message.isReply || message.from === queryString.friend) {
      setMessages((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    }
    updateLastMessage(message);
  };

  const updateStatus = (msgIds, status) => {
    const messgaeIds = typeof msgIds === "string" ? [msgIds] : msgIds;
    setMessages((prevStatus) => ({
      ...prevStatus,
      messages: [
        ...prevStatus.messages.map((msg) => {
          if (messgaeIds.includes(msg.id)) {
            const updatedMsg = { ...msg, status };
            selectedUser?.lastMessage?.id === msg.id &&
              updateLastMessage(updatedMsg);
            return updatedMsg;
          }
          return msg;
        }),
      ],
    }));
  };

  const resetChat = () => {
    selectedChatIdRef.current = null;
    setMessages(initMessages);
  };
  return {
    userDetails,
    loadingChatMessages: isLoadingMessages,
    messageDetails: messages,
    resetChat,
    updateStatus,
    setMessages,
    updateLastMessage,
    requestFetchMessages,
    handleSetMessage,
  };
};
