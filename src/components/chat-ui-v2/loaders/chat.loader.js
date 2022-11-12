import whatsAppLogo from "./../../../assets/images/whatsapp.png";

export const ChatLoader = ({ bgWhite }) => {
  return (
    <div
      className={`w-full h-full opacity-80 flex justify-center items-center absolute top-1/2 left-1/2 ${
        bgWhite ? "bg-grey-lighter" : "bg-chat-color"
      } z-10 -translate-y-1/2 -translate-x-1/2`}>
      <img
        className={`h-14 w-14 opacity-40 object-cover`}
        src={whatsAppLogo}
        alt={"whatsApp Logo"}
      />
    </div>
  );
};
