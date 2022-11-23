/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useQuery } from "react-query";
import { ChatProvider } from "../../context/chat.context";
import { useChatManager } from "../../hooks/chat/useChatManager";
import { useChatSelection } from "../../hooks/chat/useChatSelection";
import { useSocketManager } from "../../hooks/chat/useSocketManager";
import { contactDetailQuery } from "../../pages/Chat";

const ChatDataProvider = ({ children }) => {
  const [typing, setTyping] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: user, refetch } = useQuery(contactDetailQuery());

  const {
    messageDetails,
    userDetails,
    loadingChatMessages,
    updateLastMessage,
    handleSetMessage,
    resetChat,
    setMessages,
    requestFetchMessages,
    updateStatus,
  } = useChatManager(user, selectedUser);

  const {
    isAddingFrined,
    userData,
    isSearchResult,
    isSelectedUserOnline,
    removeSelectedUser,
    setIsSelectedUserOnline,
    handleChatSelection,
  } = useChatSelection(
    userDetails,
    resetChat,
    refetch,
    selectedUser,
    setSelectedUser
  );

  const { socketManager } = useSocketManager({
    setTyping,
    handleSetMessage,
    setMessages,
    updateStatus,
    setIsSelectedUserOnline,
  });

  return (
    <ChatProvider
      value={{
        userDetails,
        users: userData,
        selectedUser,
        isSearchResult,
        typing,
        isAddingFrined,
        messageDetails: messageDetails,
        loadingChatMessages,
        isSelectedUserOnline,
        isMobileView: window.innerWidth <= 768,
        removeSelectedUser,
        requestFetchMessages,
        updateLastMessage,
        setIsSelectedUserOnline,
        setMessages,
        handleSetMessage,
        setTyping,
        updateStatus,
        handleChatSelection,
        emitFetchFriendStatus: socketManager.emitFetchFriendStatus,
        emitTypingStatus: socketManager.emitTypingStatus,
        emitMessage: socketManager.emitMessage,
        emitMessageStatus: socketManager.emitMessageStatus,
      }}>
      {children}
    </ChatProvider>
  );
};

export default ChatDataProvider;
