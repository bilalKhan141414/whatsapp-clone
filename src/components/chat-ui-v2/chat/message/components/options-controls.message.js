import { useChatContext } from "../../../../../shared/custom-hooks/useChatContext";

//
export const MessageOptionsControls = ({ id }) => {
  const { onMessageEdit } = useChatContext();
  return (
    <span
      className='w-6 h-7 cursor-pointer rounded-bl-xl hidden group-hover:inline-flex justify-center items-center msg-options absolute msg-options roun top-0 -right-1'
      style={{ background: "#E2F7CB", boxShadow: "-4px 3px 10px #e2f7cb " }}
      onClick={() => onMessageEdit(id)}>
      <svg
        width='18px'
        height='18px'
        viewBox='0 0 32 32'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          fill='#47622a52'
          d='M 4.21875 9.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 9.78125 L 16 20.5625 Z'
        />
      </svg>
    </span>
  );
};
