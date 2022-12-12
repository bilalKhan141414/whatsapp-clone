export const PlayIcon = ({ handleClick, isPlaying }) => {
  return (
    <>
      {isPlaying ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16px'
          height='18px'
          viewBox='0 0 16 18'
          onClick={handleClick}
          className={`cursor-pointer`}>
          <path
            d='M1.9,1c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1H5c0.6,0,1-0.4,1-1V2c0-0.6-0.4-1-1-1H1.9z'
            fill='#91a0a9'></path>
          <path
            fill='#91a0a9'
            d='M10.9,1c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h3.1c0.6,0,1-0.4,1-1V2c0-0.6-0.4-1-1-1H10.9z'></path>
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16px'
          height='18px'
          viewBox='0 0 16 18'
          onClick={handleClick}
          className={`cursor-pointer`}>
          <path
            d='M15.05,8.39,2,.32a1,1,0,0,0-1.53.85V16.83A1,1,0,0,0,2,17.7L15,10.1A1,1,0,0,0,15.05,8.39Z'
            fill='#91a0a9'></path>
        </svg>
      )}
    </>
  );
};
