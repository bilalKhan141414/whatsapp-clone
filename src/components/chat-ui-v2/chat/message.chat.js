/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";

const ChatMessage = ({ message, isReply, serverMessage }) => {
  const [isSending, setIsSending] = useState(false);
  const { emitMessage } = useChatContext();
  useEffect(() => {
    if (serverMessage) {
      setIsSending(true);
      emitMessage(serverMessage, () => setIsSending(false));
    }
  }, []);

  return (
    <div className={`flex mb-2 ${isReply ? "justify-end" : ""}`}>
      <div
        className='rounded py-2 px-3'
        style={{ backgroundColor: isReply ? "#E2F7CB" : "#F2F2F2" }}>
        {!isReply && <p className='text-sm text-orange'>{message?.userName}</p>}
        <p className='text-sm mt-1'>{message.text}</p>
        <p className='text-right text-xs text-grey-dark mt-1'>
          {isSending ? "sending..." : message.time}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
