import { useChatContext } from "../../../shared/custom-hooks/useChatContext";
import ContactList from "./contacts/contact-list.sidebar";
import Header from "./header.sidebar";
import Search from "./search.sidebar";
// const data = [
//   {
//     profile: "",
//     name: "",
//     lastMessage: {
//       time: "",
//       text: "",
//     },
//   },
// ];
const Sidebar = () => {
  const { users, userDetails, isMobileView, selectedUser } = useChatContext();
  const hideSideBar = isMobileView && selectedUser;
  return (
    <div
      data-selected={!!selectedUser}
      className={`${
        hideSideBar ? "hidden" : ""
      } w-full bg-white z-20 h-full absolute top-0 left-0 md:relative md:w-1/3 border flex flex-col`}>
      <Header userDetails={userDetails} />
      <Search />
      <ContactList users={users} />
    </div>
  );
};

export default Sidebar;
