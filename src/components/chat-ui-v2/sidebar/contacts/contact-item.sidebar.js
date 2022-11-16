import { MESSAGE_STATUS } from "../../../../constants/events.constant";
import { localStorageHelpers } from "../../../../shared/Helpers/general";
import { getFormatedTime } from "../../chat";
import { UserSingleIcon } from "../../user-icon/user-single-icon";

const activeClass = "bg-gray-200";
const inactiveClass = "bg-white hover:bg-grey-lighter";

const ContactItem = ({ user, onClick, isSelected, isTyping }) => {
  const seenLastMessage =
    user?.lastMessage?.status === MESSAGE_STATUS.SEEN ||
    user?.lastMessage?.from === localStorageHelpers.User.id;
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
          {user?.lastMessage?.date && (
            <p
              className={`text-xs ${
                !seenLastMessage ? "theme-light-green" : "text-gray-400"
              }`}>
              {getFormatedTime(user?.lastMessage?.date)}
            </p>
          )}
        </div>
        <p
          className={`${
            isTyping || !seenLastMessage ? "text-black" : "text-gray-400"
          } mt-1 text-xs text-ellipsis overflow-hidden whitespace-nowrap w-36`}>
          {isTyping ? "typing..." : user?.lastMessage?.text ?? ""}
        </p>
      </div>
    </div>
  );
};

export default ContactItem;
