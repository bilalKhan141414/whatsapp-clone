/* eslint-disable react-hooks/exhaustive-deps */
// import { ChatLoader } from "../loaders/chat.loader";
import { useEffect } from "react";
import { useSendMessage } from "../../../hooks/chat/useSendMessage";
import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import { useQueryString } from "../../../shared/custom-hooks/useQueryString";
import { localStorageHelpers } from "../../../shared/Helpers/general";
import ChatFooter from "./footer.chat";
import { ChatHeader } from "./header.chat";
import { DateLabel, NotificationLabel } from "./labels";
import ChatMessage from "./message.chat";

export const ChatContainer = () => {
  const {} = useSendMessage();
  const { queryString } = useQueryString();
  const { emitFetchFriendStatus, messages } = useChatContext();

  useEffect(() => {
    if (queryString.friend) {
      emitFetchFriendStatus(queryString.friend, (status) => {
        console.log("friendstatus :: ", status);
      });
    }
  }, [queryString.friend]);

  return (
    <div className='w-2/3 border flex flex-col'>
      <ChatHeader />
      <div
        id={`chat-container`}
        className='flex-1 overflow-auto relative'
        style={{ backgroundColor: "#DAD3CC" }}>
        {/* <ChatLoader /> */}
        <div className='py-2 px-3 '>
          <DateLabel />
          <NotificationLabel />
          {messages?.length > 0 &&
            messages.map((message, index) => {
              return (
                <ChatMessage
                  isReply={message.from === localStorageHelpers.User.id}
                  message={{
                    userName: message.userName,
                    text: message.text,
                    time: new Date(message.date).toLocaleTimeString(),
                  }}
                  serverMessage={message.ServerMessage}
                />
              );
            })}
          {/* <ChatMessage
            message={{
              userNameColor: "text-teal",
              userName: "Sylverter Stallone",
              text: "Hi everyone! Glad you could join! I am making a new movie.",
              time: "12:45 pm",
            }}
          />
          <ChatMessage
            message={{
              userNameColor: "text-purple",
              userName: "Tom Cruise",
              text: "Hi all! I have one question for the movie",
              time: "12:45 pm",
            }}
          />
          <ChatMessage
            message={{
              userNameColor: "text-orange",
              userName: "Harrison Ford",
              text: "Again?",
              time: "12:45 pm",
            }}
          />
          <ChatMessage
            message={{
              userNameColor: "text-orange",
              userName: "Russell Crowe",
              text: "Is Andrés coming for this one?",
              time: "12:45 pm",
            }}
          />
          <ChatMessage
            message={{
              userNameColor: "text-teal",
              userName: "Sylverter Stallone",
              text: "He is. Just invited him to join.",
              time: "12:45 pm",
            }}
          />
          <ChatMessage
            message={{
              userNameColor: "",
              userName: "",
              text: "Hi guys.",
              time: "12:45 pm",
            }}
            isReply
          />
          <ChatMessage
            message={{
              userNameColor: "",
              userName: "",
              text: "Count me in",
              time: "12:45 pm",
            }}
            isReply
          />
          <ChatMessage
            message={{
              userNameColor: "text-purple",
              userName: "Tom Cruise",
              text: "Get Andrés on this movie ASAP!",
              time: "12:45 pm",
            }}
          /> */}
        </div>
      </div>

      {/* Chat-Footer */}
      <ChatFooter />
    </div>
  );
};
