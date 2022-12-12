export const MessageBody = ({ children, onlySmily, isReply }) => {
  return (
    <div
      className={`msg-body flex ${
        onlySmily
          ? `flex-col items-start ${!isReply ? "items-end" : ""}`
          : "justify-end items-center"
      }  flex-wrap`}>
      {children}
    </div>
  );
};
