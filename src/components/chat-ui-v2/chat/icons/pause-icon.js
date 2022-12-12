export const PauseIcon = ({ handleClick }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={32}
      height={32}
      viewBox='0 0 32 32'
      className='cursor-pointer'
      onClick={handleClick}>
      <circle
        cx='16'
        cy='16'
        r='14.75'
        fill='none'
        stroke='#ff4e44'
        strokeWidth='2.5'></circle>
      <path
        d='M20.65,21.69V10.25H17.31V21.69Zm-9.3-11.44V21.69h3.34V10.25Z'
        fill='#ff4e44'></path>
    </svg>
  );
};
