import { useContext } from "react";
import { chatContext } from "../../context/chat.context";

export const useChatContext = () => {
  return useContext(chatContext);
};
