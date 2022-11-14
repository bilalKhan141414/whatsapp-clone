/* eslint-disable react-hooks/exhaustive-deps */
import { ChatLoader } from "../loaders/chat.loader";
import { useEffect, useRef } from "react";
import { useSendMessage } from "../../../hooks/chat/useSendMessage";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import { useQueryString } from "../../../shared/custom-hooks/useQueryString";
import { localStorageHelpers } from "../../../shared/Helpers/general";
import ChatFooter from "./footer.chat";
import { ChatHeader } from "./header.chat";
import { DateLabel, NotificationLabel } from "./labels";
import ChatMessage from "./message.chat";

const getFormatedTime = (fullDate) => {
  const date = new Date(fullDate);
  const formatedDate = date.toLocaleTimeString();
  const firstPart = formatedDate.split(" ")[0].split(":");
  return `${firstPart[0]}:${firstPart[1]} ${formatedDate.split(" ")[1]}`;
};
let lastDate = null;

const GetDateChange = ({ date }) => {
  const today = new Date().toLocaleDateString();
  let yesterDay = new Date();
  yesterDay.setDate(new Date().getDate() - 1);
  yesterDay = yesterDay.toLocaleDateString();
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
export const ChatContainer = () => {
  lastDate = null;
  useSendMessage();
  const { queryString } = useQueryString();
  const chatContainerRef = useRef(null);
  const {
    emitFetchFriendStatus,
    // setmsgApiData,
    messages,
    selectedUser,
    loadingChatMessages,
  } = useChatContext();
  useEffect(() => {
    const handleScroll = (e) => {};
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (queryString.friend) {
      emitFetchFriendStatus(queryString.friend, ({ status }) => {
        console.log("friendstatus :: ", status);
      });
    }
  }, [queryString.friend]);

  return (
    <div className='w-2/3 border flex flex-col'>
      <ChatHeader />
      <div
        id={`chat-container`}
        ref={chatContainerRef}
        className='flex-1 overflow-auto relative'
        style={{ backgroundColor: "#DAD3CC" }}>
        {loadingChatMessages && <ChatLoader />}
        <div className='py-2 px-3 '>
          <NotificationLabel />
          {!loadingChatMessages &&
            messages?.length > 0 &&
            messages.map((message, index) => {
              return (
                <ChatMessage
                  key={index}
                  isReply={message.from === localStorageHelpers.User.id}
                  message={{
                    id: message.id,
                    userName: selectedUser.userName,
                    text: message.text,
                    time: getFormatedTime(message.date),
                    status: message.status,
                    to: message.to,
                    from: message.from,
                    allowScroll: message.allowScroll,
                  }}
                  serverMessage={message.ServerMessage}>
                  <GetDateChange date={message.date} />
                </ChatMessage>
              );
            })}
        </div>
      </div>

      <ChatFooter />
    </div>
  );
};
