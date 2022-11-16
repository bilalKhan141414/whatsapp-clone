export const ChatLoader = ({ bgWhite }) => {
  return (
    <div
      style={{ backgroundColor: "#449388" }}
      className={`absolute rounded py-1 px-4 text-xs top-2 text-white shadow-md left-1/2 -translate-x-1/2 z-10`}>
      <span className='tracking-wide'>Loading...</span>
    </div>
  );
};
