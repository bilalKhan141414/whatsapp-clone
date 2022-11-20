import { MESSAGE_STATUS } from "../../../../constants/events.constant";
import { localStorageHelpers } from "../../../../shared/Helpers/general";
import { getYesterday } from "../../../../utils/date.util";
import { getFormatedTime } from "../../chat";
import { DoubleCheck } from "../../chat/status-checks/doble-check";
import { UserSingleIcon } from "../../user-icon/user-single-icon";

const activeClass = "bg-gray-200";
const inactiveClass = "bg-white hover:bg-grey-lighter";
const getDate = (date) => {
  const today = new Date().toLocaleDateString();
  const { yesterDay } = getYesterday();
  const dateObject = new Date(date);
  const currentDate = dateObject.toLocaleDateString();
  const todaysMsg = today === currentDate;
  if (todaysMsg) {
    return getFormatedTime(date);
  }
  const yesterDayMsg = yesterDay === currentDate;
  if (yesterDayMsg) {
    return "yesterday";
  }
  return currentDate;
};
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
          <p className={`text-sm  text-grey-darkest capitalize `}>
            {user.userName}
          </p>
          {user?.lastMessage?.date && (
            <p
              className={`text-xs ${
                !seenLastMessage
                  ? "theme-light-green font-semibold"
                  : "text-gray-500"
              }`}>
              {getDate(user?.lastMessage?.date)}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center '>
            <DoubleCheck
              horizontalViewPort={29}
              noMargin
              status={user?.lastMessage?.status}
            />
            <p
              className={`${
                isTyping ? "theme-light-green" : "text-gray-500"
              } mt-1  tracking-wider text-xs text-ellipsis overflow-hidden whitespace-nowrap w-36`}>
              {isTyping ? "typing..." : <>{user?.lastMessage?.text ?? ""}</>}
            </p>
          </div>
          {user?.lastMessage?.totalUnSeen > 0 && (
            <span className='rounded-full bg-theme-light-green inline-flex justify-center items-center  w-5 h-5 text-mini text-white helvatica-bold '>
              {user?.lastMessage?.totalUnSeen >= 10
                ? "+9"
                : user?.lastMessage?.totalUnSeen}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
