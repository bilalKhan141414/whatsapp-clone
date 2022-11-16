/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useQuery } from "react-query";
import { ChatProvider } from "../../context/chat.context";
import { useChatManager } from "../../hooks/chat/useChatManager";
import { useChatSelection } from "../../hooks/chat/useChatSelection";
import { useSocketManager } from "../../hooks/chat/useSocketManager";
import { contactDetailQuery } from "../../pages/Chat";

const ChatDataProvider = ({
  message,
  getUploadeFile = () => {},
  handleOnKeyPress = () => {},
  setMessage = () => {},
  children,
}) => {
  const [typing, setTyping] = useState(null);

  const { data: user, refetch } = useQuery(contactDetailQuery());

  const {
    messages,
    userDetails,
    loadingChatMessages,
    updateLastMessage,
    handleSetMessage,
    resetChat,
    setMessages,
    setmsgApiData,
    updateStatus,
  } = useChatManager(user);

  const {
    selectedUser,
    isAddingFrined,
    userData,
    isSearchResult,
    isSelectedUserOnline,
    setIsSelectedUserOnline,
    handleChatSelection,
  } = useChatSelection(userDetails, resetChat, refetch);

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
        value: message,
        userDetails,
        users: userData,
        selectedUser,
        isSearchResult,
        typing,
        isAddingFrined,
        messages,
        loadingChatMessages,
        isSelectedUserOnline,
        updateLastMessage,
        setIsSelectedUserOnline,
        setMessages,
        setmsgApiData,
        handleSetMessage,
        setTyping,
        updateStatus,
        getUploadeFile,
        handleOnKeyPress,
        handleOnChange: (event) => setMessage(event.target.value),
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
