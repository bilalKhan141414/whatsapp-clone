/* eslint-disable react-hooks/exhaustive-deps */
import { ChatLoader } from "../loaders/chat.loader";
import { useEffect } from "react";
import { useSendMessage } from "../../../hooks/chat/useSendMessage";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import { useQueryString } from "../../../shared/custom-hooks/useQueryString";
import { localStorageHelpers } from "../../../shared/Helpers/general";
import ChatFooter from "./footer.chat";
import { ChatHeader } from "./header.chat";
import { DateLabel, NotificationLabel } from "./labels";
import ChatMessage from "./message.chat";
import { getYesterday } from "../../../utils/date.util";
import { useChatScrolling } from "../../../hooks/chat/useChatScrolling";

export const getFormatedTime = (fullDate) => {
  const date = new Date(fullDate);
  const formatedDate = date.toLocaleTimeString();
  const firstPart = formatedDate.split(" ")[0].split(":");
  return `${firstPart[0]}:${firstPart[1]} ${formatedDate.split(" ")[1]}`;
};

let lastDate = null;
const GetDateChange = ({ date }) => {
  const today = new Date().toLocaleDateString();
  const { yesterDay } = getYesterday();
  const dateObject = new Date(date);
  const currentDate = dateObject.toLocaleDateString();
  if (lastDate !== currentDate) {
    const todaysMsg = today === currentDate;
    const yesterDayMsg = yesterDay === currentDate;
    const foramtedDate = todaysMsg
      ? "Today"
      : yesterDayMsg
      ? "Yesterday"
      : dateObject.toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    lastDate = currentDate;
    return <DateLabel key={date} date={foramtedDate} />;
  }
};

const isSameUser = (index, messages, currentUser) =>
  index === 0 ? false : messages[index - 1].from === currentUser;

export const ChatContainer = () => {
  const {
    emitFetchFriendStatus,
    setIsSelectedUserOnline,
    messageDetails,
    selectedUser,
    isMobileView,
    loadingChatMessages,
  } = useChatContext();

  const { queryString } = useQueryString();

  const { chatContainerRef, handleScroll } = useChatScrolling();

  useSendMessage();

  useEffect(() => {
    if (queryString.friend) {
      emitFetchFriendStatus(queryString.friend, ({ status }) => {
        setIsSelectedUserOnline(status);
      });
    }
  }, [queryString.friend]);

  const shouldScrollToBottom = +selectedUser?.lastMessage?.totalUnSeen === 0;
  return (
    <div className='w-full h-full bg-white absolute top-0 left-0 md:relative md:w-2/3 z-10 border flex flex-col chat-container'>
      <ChatHeader />
      <div
        id={`chat-container`}
        ref={chatContainerRef}
        onScroll={handleScroll}
        className='flex-1 overflow-auto relative'
        style={{ backgroundColor: "#DAD3CC" }}>
        {loadingChatMessages && <ChatLoader />}
        <div className='py-2 px-3 '>
          <NotificationLabel />
          {messageDetails?.messages?.length > 0 &&
            messageDetails?.messages.map((message, index) => {
              if (index === 0) lastDate = null;
              return (
                <ChatMessage
                  key={index}
                  messageD={message}
                  isReply={message.from === localStorageHelpers.User.id}
                  message={{
                    id: message.id,
                    userName: selectedUser?.userName,
                    text: message.text,
                    time: getFormatedTime(message.date),
                    status: message.status,
                    to: message.to,
                    from: message.from,
                    userStatus: message.userStatus,
                    sameUser: isSameUser(
                      index,
                      messageDetails?.messages,
                      message.from
                    ),
                  }}
                  isLastMessage={messageDetails?.messages?.length - 1 === index}
                  shouldScrollToBottom={shouldScrollToBottom}
                  serverMessage={message.ServerMessage}>
                  <GetDateChange date={message.date} />
                </ChatMessage>
              );
            })}
        </div>
      </div>

      <ChatFooter isMobileView={isMobileView} />
    </div>
  );
};
