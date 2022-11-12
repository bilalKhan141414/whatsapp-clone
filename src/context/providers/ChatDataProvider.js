/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useQuery } from "react-query";
import { ChatProvider } from "../../context/chat.context";
import { useChatManager } from "../../hooks/chat/useChatManager";
import useChatMutations from "../../hooks/chat/useChatMutations";
import { useChatSelection } from "../../hooks/chat/useChatSelection";
import { useSocketManager } from "../../hooks/chat/useSocketManager";
import { contactDetailQuery } from "../../pages/Chat";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";

const ChatDataProvider = ({
  message,
  getUploadeFile = () => {},
  handleOnKeyPress = () => {},
  setMessage = () => {},
  children,
}) => {
  const [typing, setTyping] = useState(null);

  const { queryString } = useQueryString();
  const { data: userDetails } = useQuery(contactDetailQuery());
  const { users } = useChatMutations();

  const isSearchResult = queryString?.search?.length > 0;
  const userData = isSearchResult ? users?.data : userDetails?.data?.friends;
  const { handleSetMessage, resetChat, messages } = useChatManager();

  const { handleChatSelection, selectedUser } = useChatSelection(
    userData,
    resetChat
  );

  const { socketManager } = useSocketManager(setTyping, handleSetMessage);

  return (
    <ChatProvider
      value={{
        value: message,
        userDetails: userDetails?.data,
        users: userData,
        selectedUser,
        isSearchResult,
        typing,
        messages,
        handleSetMessage,
        setTyping,
        getUploadeFile,
        handleOnKeyPress,
        handleOnChange: (event) => setMessage(event.target.value),
        handleChatSelection,
        emitFetchFriendStatus: socketManager.emitFetchFriendStatus,
        emitTypingStatus: socketManager.emitTypingStatus,
        emitMessage: socketManager.emitMessage,
      }}>
      {children}
    </ChatProvider>
  );
};

export default ChatDataProvider;
