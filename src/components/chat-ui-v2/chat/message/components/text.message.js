export const MessageText = ({ onlySmily, text }) => {
  const conditionalClass = onlySmily ? "w-full text-3xl" : "text-sm";
  return (
    <p
      className={`msg-text ${conditionalClass} py-1 whitespace-pre-wrap break-all font-normal`}>
      {text}
    </p>
  );
};
