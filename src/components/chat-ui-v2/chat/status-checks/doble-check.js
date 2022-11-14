import { MESSAGE_STATUS } from "../../../../constants/events.constant";

const colorSeen = "#53bdeb";
const colorUnSeen = "#9e9e9e";
export const DoubleCheck = ({ status }) => {
  let color = colorUnSeen;
  if (status === MESSAGE_STATUS.SEEN) color = colorSeen;
  return (
    <svg
      className={`-mt-1 ${status === MESSAGE_STATUS.SENT ? "-mr-2" : "-mr-1"}`}
      width='19px'
      height='19px'
      viewBox='0 0 27 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18 7L9.42857 17L6 13'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {status !== MESSAGE_STATUS.SENT && (
        <path
          xmlns='http://www.w3.org/2000/svg'
          d='M24.5 7L14.5 18L12 15.5'
          stroke={color}
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      )}
    </svg>
  );
};
