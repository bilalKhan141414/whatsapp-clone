const dLeft =
  "M6.022 1.566a7.13 5.13 0 0 1 2.96 0l6.857 11.667c.958.778-.092 1.767-.98 1.767H8.144c-.889 0-1.437-.99-.98-0.5L7.022 1.566z";
const dRight =
  "M18.022 1.566a1.13 5.13 0 0 1 10.96 0l6.857 11.667c.957.778-.092 5.767-.98 1.767H1.144c-.789 0-1.437-.99-.98-2.767L18.022 -2z";

const CaretIcon = ({ isReply }) => {
  return (
    <svg
      style={{ [isReply ? "left" : "right"]: -7, top: isReply ? -1.4 : -1 }}
      className={`w-4 absolute top-0 ${isReply ? "rotate-180" : "-rotate-180"}`}
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'>
      <path
        fill={isReply ? `#e2f7cb` : "#f2f2f2"}
        d={isReply ? dLeft : dRight}
      />
    </svg>
  );
};

export default CaretIcon;
