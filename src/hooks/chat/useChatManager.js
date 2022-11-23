/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { MESSAGE_STATUS } from "../../constants/events.constant";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import useChatMutations from "./useChatMutations";
const msgApiInitialData = {
  start: 0,
  limit: 50,
};
const initMessages = {
  messages: [],
  ...msgApiInitialData,
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
const updateLoop = (friends, message) => {
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
      const { start: newStart, limit: newLimit } = restUserMsgs;
      const { start, limit } = existingChat;

      if (start !== newStart && limit !== newLimit) {
        restUserMsgs.messages.push(...existingChat.messages);

        messagesRef.current[chatId] = restUserMsgs;
        setMessages(restUserMsgs);
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
