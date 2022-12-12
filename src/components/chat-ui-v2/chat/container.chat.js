export const ChatContainer = ({ children }) => {
  return (
    <div
      className='h-screen overflow-hidden '
      style={{ backgroundColor: "#edf2f7" }}>
      <div>
        <div
          className='w-full h-32'
          style={{ backgroundColor: "#449388" }}></div>

        <div className='container mx-auto' style={{ marginTop: " -128px" }}>
          <div className='py-6 h-screen'>
            <div className='flex border border-grey rounded shadow-lg h-full'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
