/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { MESSAGE_STATUS } from "../../../constants/events.constant";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import { encode } from "../../../utils/encoder.util";
import { DoubleCheck } from "./status-checks/doble-check";
const ChatMessage = ({
  message,
  isReply,
  serverMessage,
  children,
  isGroup,
}) => {
  const [setIsSending] = useState(false);
  const { emitMessage, emitMessageStatus, updateStatus } = useChatContext();
  useEffect(() => {
    if (serverMessage) {
      setIsSending(true);
      emitMessage(encode(serverMessage), (status) => {
        setIsSending(false);
        console.log();
        updateStatus(message.id, status);
      });
    }
    const handleScroll = (e) => {
      const chatContainer = e
        ? e.target
        : document.getElementById("chat-container");
      const msgEleBounds = document
        .getElementById(message.id)
        .getBoundingClientRect();
      if (msgEleBounds.top < chatContainer.offsetHeight + 100) {
        document
          .getElementById("chat-container")
          .removeEventListener("scroll", handleScroll);

        updateStatus(message.id, MESSAGE_STATUS.SEEN);
        emitMessageStatus({
          to: message.from,
          id: message.id,
          status: MESSAGE_STATUS.SEEN,
        });
      }
    };
    if (!isReply && message.status !== MESSAGE_STATUS.SEEN) {
      handleScroll();
      document
        .getElementById("chat-container")
        .addEventListener("scroll", handleScroll);
    }
    return () => {
      document
        .getElementById("chat-container")
        .removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {children}
      <div
        id={message.id}
        className={`flex mb-2 ${isReply ? "" : "justify-end"}`}>
        <div
          className='rounded px-2'
          style={{ backgroundColor: isReply ? "#E2F7CB" : "#F2F2F2" }}>
          {isGroup && (
            <p className='text-sm text-orange capitalize'>
              {message?.userName}
            </p>
          )}
          <div className='flex justify-between items-center flex-wrap'>
            <p className='text-sm '>{message.text}</p>
            <p
              className={`text-right flex justify-end items-end text-mini text-gray-500 ${
                isReply ? "mt-1" : "mt-3"
              } ml-2 mb-1 -mr-1`}>
              {message.time}
              {isReply && (
                <div className='inline-block'>
                  <span className='invisible'>
                    <svg
                      width='19px'
                      height='19px'
                      viewBox='0 0 32 32'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path d='M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z' />
                    </svg>
                  </span>
                  <DoubleCheck status={message.status} />
                </div>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
