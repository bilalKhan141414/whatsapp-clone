import React, { useState } from "react";
import MessagesQueue from "../shared/Queues/MessagesQueue";
import useSocket from "../shared/custom-hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../components/chat-ui-v2/sidebar/sidebar";
import ChatDataProvider from "../context/providers/ChatDataProvider";
import { getUserDetails } from "../queries/UserQueries";
import {
  ChatContainer,
  NoChatSelectedContainer,
} from "../components/chat-ui-v2/chat";
import { useQueryString } from "../shared/custom-hooks/useQueryString";

// localStorage.debug = '*';
const messageQueue = new MessagesQueue();

export const contactDetailQuery = () => ({
  queryKey: ["detail"],
  queryFn: async () => getUserDetails(),
});

export default function Chat({ location }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const { queryString } = useQueryString();
  const { name, broadCastMessage } = useSocket();

  const handleSendMessage = () => {
    const messageToSend = messageQueue.dequeue();
    broadCastMessage(messageToSend, (data) => {
      console.log("message::data", data);
      if (!messageQueue.isEmpty()) handleSendMessage();
    });
  };
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      handleSendMessage();
      setMessage("");
    }
  };
  const handleOnKeyPress = (event) => {
    if (event.key === "Enter" && (message.length > 0 || attachments.length)) {
      const messageToSave = {
        id: uuidv4(),
        text: message,
        from: name,
        attachments,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (!attachments.length) messageQueue.enqueue(messageToSave);
      // dispatch(addMsg({message: messageToSave}));
      sendMessage(event);
    }
  };
  const getUploadeFile = (fileData) => {
    setAttachments((prevState) => [...prevState, fileData]);
  };
  const isChatSelected = !!queryString?.friend;
  return (
    <ChatDataProvider
      message={message}
      getUploadeFile={getUploadeFile}
      handleOnKeyPress={handleOnKeyPress}
      setMessage={setMessage}>
      <div
        className='h-screen overflow-hidden '
        style={{ backgroundColor: "#edf2f7" }}>
        <div>
          <div
            className='w-full h-32'
            style={{ backgroundColor: "#449388" }}></div>

          <div className='container mx-auto' style={{ marginTop: " -128px" }}>
            <div className='py-6 h-screen'>
              <div className='flex border border-grey rounded shadow-lg h-full'>
                <Sidebar />
                {isChatSelected ? (
                  <ChatContainer />
                ) : (
                  <NoChatSelectedContainer />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatDataProvider>
  );
}
export const loader = (queryClient) => async () => {
  const query = contactDetailQuery();
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
