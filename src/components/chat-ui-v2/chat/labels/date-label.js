export const DateLabel = ({ date }) => {
  return (
    <div className='flex justify-center mb-2'>
      <div className='rounded py-2 px-4' style={{ backgroundColor: "#DDECF2" }}>
        <p className='text-sm '>{date}</p>
      </div>
    </div>
  );
};
