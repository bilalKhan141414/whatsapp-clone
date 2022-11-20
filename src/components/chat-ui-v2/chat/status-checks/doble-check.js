import { MESSAGE_STATUS } from "../../../../constants/events.constant";

const colorSeen = "#53bdeb";
const colorUnSeen = "#6b7280";
export const DoubleCheck = ({ status, noMargin, horizontalViewPort = 27 }) => {
  let color = colorUnSeen;
  if (status === MESSAGE_STATUS.SEEN) color = colorSeen;
  return (
    <svg
      className={`${noMargin ? "" : "-mt-1"} ${
        status === MESSAGE_STATUS.SENT && !noMargin ? "-mr-1" : "-mr-0"
      }`}
      width='19px'
      height='19px'
      viewBox={`0 0 ${horizontalViewPort} 20`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18 7L9.42857 17L6 13'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {status && status !== MESSAGE_STATUS.SENT && (
        <path
          xmlns='http://www.w3.org/2000/svg'
          d='M18 7.7L9.42857 17.5L8 15.5'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          style={{ transform: "translate(5px, 0.7px)" }}
        />

        // <path
        //   xmlns='http://www.w3.org/2000/svg'
        //   d='M24.5 7L14.5 18L12 15.5'
        //   stroke={color}
        //   strokeWidth='2'
        //   strokeLinecap='round'
        //   strokeLinejoin='round'
        // />
      )}
    </svg>
  );
};
