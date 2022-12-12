export const DeleteIcon = ({ handleClick }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 22'
      width={16}
      onClick={handleClick}
      className='cursor-pointer'>
      <path
        d='M5,0,3,2H0V4H16V2H13L11,0ZM15,5H1V19.5A2.5,2.5,0,0,0,3.5,22h9A2.5,2.5,0,0,0,15,19.5Z'
        fill='#91a0a9'></path>
    </svg>
  );
};
