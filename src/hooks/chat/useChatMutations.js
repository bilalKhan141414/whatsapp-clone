import { useMutation } from "react-query";
import {
  addFriend,
  getMessagesByChatIds,
  searchUsers,
} from "../../mutations/UserMuration";

const useChatMutations = () => {
  const { data: users = [], mutate: searchFriend } = useMutation(
    ["search-users"].xyzGlobalKey(),
    searchUsers
  );
  const { mutateAsync: requestAddFriend } = useMutation(
    ["add-friend"].xyzGlobalKey(),
    addFriend
  );

  const {
    data: userMessages,
    mutateAsync: requestFetchMessages,
    isLoading: isLoadingMessages,
  } = useMutation(["fetch-messages"].xyzGlobalKey(), getMessagesByChatIds);
  return {
    users,
    userMessages,
    searchFriend,
    requestAddFriend,
    isLoadingMessages,
    requestFetchMessages,
  };
};

export default useChatMutations;
