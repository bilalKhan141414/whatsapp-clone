import { useMutation } from "react-query";
import { addFriend, searchUsers } from "../../mutations/UserMuration";

const useChatMutations = () => {
  const { data: users = [], mutate: searchFriend } = useMutation(
    ["search-users"],
    searchUsers
  );
  const { mutateAsync: requestAddFriend } = useMutation(
    ["add-friend"],
    addFriend
  );

  return {
    users,
    searchFriend,
    requestAddFriend,
  };
};

export default useChatMutations;
