import { DoubleCheck } from "../../status-checks/doble-check";
import { MessageOptionsControls } from "./options-controls.message";

export const MessageTime = ({ onlySmily, isReply, status, time, id }) => {
  return (
    <p
      className={`msg-time relative h-7 flex ${
        onlySmily && isReply ? "" : "items-end text-right "
      } justify-end text-mini text-gray-500  ml-2 -mr-1`}
      style={{
        marginBottom: 3,
        color: "#0000008c",
        fontSize: "0.65rem",
      }}>
      {time}
      {isReply && (
        <span className='inline-block'>
          <MessageOptionsControls id={id} />
          <DoubleCheck status={status} />
        </span>
      )}
    </p>
  );
};
