import { useState } from "react";

export const useChatManager = () => {
  const [messages, setMessages] = useState([]);

  const handleSetMessage = (message) => {
    setMessages((prevstate) => [...prevstate, message]);
  };
  const resetChat = () => setMessages([]);
  return {
    messages,
    resetChat,
    handleSetMessage,
  };
};
