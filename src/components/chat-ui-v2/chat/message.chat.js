/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  MESSAGE_STATUS,
  USER_STATUS,
} from "../../../constants/events.constant";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import { encode } from "../../../utils/encoder.util";
import CaretIcon from "./caret-icon";
import { DoubleCheck } from "./status-checks/doble-check";
const anyThingNotSmily = (str) => {
  for (var i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) <= 255) {
      return true;
    }
  }
  return false;
};
const checkForOnlySmily = (text) => text.length <= 4 && !anyThingNotSmily(text);

const ChatMessage = ({
  message,
  isReply,
  serverMessage,
  children,
  isGroup,
}) => {
  const [isSending, setIsSending] = useState(false);
  const { emitMessage, emitMessageStatus, updateStatus, isSelectedUserOnline } =
    useChatContext();
  useEffect(() => {
    if (serverMessage) {
      setIsSending(true);
      emitMessage(
        encode({
          ...serverMessage,
          userStatus: isSelectedUserOnline
            ? USER_STATUS.ONLINE
            : USER_STATUS.OFFLINE,
        }),
        (status) => {
          setIsSending(false);
          console.log(status);
          updateStatus(message.id, status);
        }
      );
    }
    const removeScrollEvent = () =>
      document
        .getElementById("chat-container")
        ?.removeEventListener("scroll", handleScroll);

    const getElements = (e) => {
      const chatContainer = e
        ? e.target
        : document.getElementById("chat-container");
      const msgEleBounds = document
        .getElementById(message.id)
        .getBoundingClientRect();
      return {
        chatContainer,
        msgEleBounds,
      };
    };
    const handleScroll = (e) => {
      const { chatContainer, msgEleBounds } = getElements(e);

      const isMessageVisible =
        msgEleBounds.top < chatContainer.offsetHeight + 100;

      if (isMessageVisible) {
        removeScrollEvent();
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
        ?.getElementById("chat-container")
        ?.addEventListener("scroll", handleScroll);

      document
        .getElementById(message.id)
        ?.addEventListener("click", (e) => handleScroll());
      if (message.userStatus === USER_STATUS.OFFLINE) {
        console.log("userStatus,", USER_STATUS);
        emitMessageStatus({
          to: message.from,
          id: message.id,
          status: MESSAGE_STATUS.RECEIVED,
        });
      }
    }

    return () => {
      removeScrollEvent();
    };
  }, []);
  const onlySmily = checkForOnlySmily(message.text);
  return (
    <>
      {children}
      <div
        data-issending={isSending}
        id={message.id}
        className={` flex mb-2 ${isReply ? "" : "justify-end"}`}>
        <div
          className={`relative rounded-xl ${
            !message.sameUser
              ? isReply
                ? "rounded-tl-none"
                : "rounded-tr-none"
              : ""
          } px-2`}
          style={{
            backgroundColor: onlySmily
              ? "transparent"
              : isReply
              ? "#E2F7CB"
              : "#F2F2F2",
            maxWidth: "90%",
          }}>
          {!message.sameUser && !onlySmily && <CaretIcon isReply={isReply} />}
          {isGroup && (
            <p className='text-sm text-orange capitalize'>
              {message?.userName}
            </p>
          )}
          <div
            className={`flex ${
              onlySmily ? "flex-col" : "justify-end"
            } items-center flex-wrap`}>
            <p
              className={`${
                onlySmily ? "w-full text-3xl" : "text-sm"
              } py-1 whitespace-pre-wrap break-all font-normal`}>
              {message.text}
            </p>
            <p
              className={`h-7 text-right flex justify-end items-end text-mini text-gray-500  ml-2 -mr-1`}
              style={{ marginBottom: 3 }}>
              {message.time}
              {isReply && (
                <div className='inline-block'>
                  <span className='hidden'>
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
