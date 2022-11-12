import { UserSingleIcon } from "../../user-icon/user-single-icon";

const activeClass = "bg-gray-200";
const inactiveClass = "bg-white hover:bg-grey-lighter";

const ContactItem = ({ user, onClick, isSelected, isTyping }) => {
  return (
    <div
      data-id={user._id}
      className={`py-1 px-3 flex items-center cursor-pointer ${
        isSelected ? activeClass : inactiveClass
      }`}
      onClick={() => onClick(user._id)}>
      <div>
        <UserSingleIcon src={user.profile} />
      </div>
      <div className='ml-4 flex-1 border-b border-gray-100 py-4'>
        <div className='flex items-bottom justify-between'>
          <p className='text-grey-darkest capitalize'>{user.userName}</p>
          <p className='text-xs text-grey-darkest'>{user?.lastMessage?.time}</p>
        </div>
        <p className='text-grey-dark mt-1 text-sm'>
          {isTyping ? "typing..." : user?.lastMessage?.text}
        </p>
      </div>
    </div>
  );
};

export default ContactItem;
