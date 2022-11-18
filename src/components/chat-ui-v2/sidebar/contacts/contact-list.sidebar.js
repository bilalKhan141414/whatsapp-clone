import { useChatContext } from "../../../../shared/custom-hooks/useChatContext";
import { useQueryString } from "../../../../shared/custom-hooks/useQueryString";
import { ChatLoader } from "../../loaders/chat.loader";
import ContactItem from "./contact-item.sidebar";

const ContactList = ({ users }) => {
  const { queryString } = useQueryString();
  const { handleChatSelection, typing, isAddingFrined } = useChatContext();

  return (
    <div className='bg-white md:bg-grey-lighter flex-1 overflow-auto relative'>
      {isAddingFrined && <ChatLoader />}
      {users?.map((user, index) => (
        <ContactItem
          isSelected={user._id === queryString.friend}
          onClick={handleChatSelection}
          isTyping={
            typing?.userId !== queryString.friend &&
            user._id === typing?.userId &&
            typing?.typing
          }
          user={user}
          key={index}
        />
      ))}
    </div>
  );
};

export default ContactList;
