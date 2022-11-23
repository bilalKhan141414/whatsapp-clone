/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useChatContext } from "../../shared/custom-hooks/useChatContext";

let disableScrolling = false;
export const useChatScrolling = () => {
  const isLoadingDataByScrollingRef = useRef(false);
  const chatContainerRef = useRef(null);

  const {
    messageDetails,
    loadingChatMessages,
    selectedUser,
    requestFetchMessages,
  } = useChatContext();

  const allMessagesAreLoaded =
    !loadingChatMessages &&
    messageDetails?.messages?.length > 0 &&
    !isLoadingDataByScrollingRef.current;

  useEffect(() => {
    if (allMessagesAreLoaded) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
      });
    }
  }, [allMessagesAreLoaded]);

  const handleScroll = async (e) => {
    if (
      !disableScrolling &&
      !messageDetails?.isDone &&
      e.currentTarget.scrollTop < 150
    ) {
      isLoadingDataByScrollingRef.current = true;
      disableScrolling = true;
      await requestFetchMessages({
        chatId: selectedUser.chatId,
        start: messageDetails.limit,
        limit: messageDetails.limit + 50,
      });
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight / 3,
      });
      disableScrolling = false;
    }
  };
  return { handleScroll, chatContainerRef };
};
