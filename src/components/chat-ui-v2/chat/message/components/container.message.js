export const MessageContainer = ({
  children,
  sameUser,
  isReply,
  onlySmily,
}) => {
  return (
    <div
      className={`msg-container group overflow-hidden relative rounded-xl ${
        !sameUser ? (isReply ? "rounded-tl-none" : "rounded-tr-none") : ""
      } px-2`}
      style={{
        backgroundColor: onlySmily
          ? "transparent"
          : isReply
          ? "#E2F7CB"
          : "#F2F2F2",
        maxWidth: "90%",
      }}>
      {children}
    </div>
  );
};
