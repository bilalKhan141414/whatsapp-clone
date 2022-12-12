/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useChatContext } from "../../../../../shared/custom-hooks/useChatContext";

export const MessageOptionsContainer = ({ hide, id }) => {
  const messageOptionsContainerRef = useRef(null);
  const { selectedMessage } = useChatContext();
  useEffect(() => {
    const handleDocumentClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { target } = e;
      if (
        selectedMessage === id &&
        !messageOptionsContainerRef.current.contains(target)
      ) {
        console.log(
          "working",
          messageOptionsContainerRef.current,
          messageOptionsContainerRef.current.contains(target),
          target
        );
      }
    };
    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div
      ref={messageOptionsContainerRef}
      className={`bg-white absolute top-5 -left-2 z-10 rounded shadow text-sm p-1 ${
        selectedMessage === id
          ? "transition-transform scale-1"
          : "hidden scale-0"
      }`}>
      <div className='p-1 cursor-pointer'>Message Info</div>
      <div className='p-1 cursor-pointer'>Reply</div>
      <div className='p-1 cursor-pointer'>Forward Message</div>
      <div className='p-1 cursor-pointer'>Start Message</div>
      <div className='p-1 cursor-pointer'>Delete Message</div>
    </div>
  );
};
