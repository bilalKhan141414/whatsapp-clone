import { useChatMessageStatus } from "../../../../hooks/chat/useChatMessageStatus";
import { checkForOnlySmily } from "../../../../hooks/chat/utils/chat-message.util";
import CaretIcon from "../caret-icon";
import {
  MessageBody,
  MessageContainer,
  MessageOptionsContainer,
  MessageText,
  MessageTime,
  MessageUserName,
} from "./components";

const ChatMessage = ({
  message,
  isReply,
  shouldScrollToBottom,
  isLastMessage,
  serverMessage,
  children,
  isGroup,
  hide,
  onMessageEdit,
  selectedMessage,
}) => {
  useChatMessageStatus({
    message,
    isReply,
    serverMessage,
    shouldScrollToBottom,
    isLastMessage,
  });
  const { id, text, time, status, sameUser, userName } = message;
  const onlySmily = checkForOnlySmily(text);

  const commonPros = {
    onlySmily,
    isReply,
  };
  return (
    <>
      {children}
      <div
        id={id}
        className={` flex mb-2 relative ${isReply ? "" : "justify-end"}`}>
        <MessageOptionsContainer hide={hide} id={id} />
        <MessageContainer {...commonPros} sameUser={sameUser}>
          {!sameUser && !onlySmily && <CaretIcon isReply={isReply} />}
          {isGroup && <MessageUserName userName={userName} />}

          <MessageBody {...commonPros}>
            <MessageText {...commonPros} text={text} />
            <MessageTime
              id={id}
              {...commonPros}
              status={status}
              time={time}
              onMessageEdit={onMessageEdit}
            />
          </MessageBody>
        </MessageContainer>
      </div>
    </>
  );
};

export default ChatMessage;
