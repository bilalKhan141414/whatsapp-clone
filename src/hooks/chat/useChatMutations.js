import { useMutation } from "react-query";
import {
  addFriend,
  getMessagesByChatIds,
  searchUsers,
} from "../../mutations/UserMuration";

const useChatMutations = () => {
  const { data: users = [], mutate: searchFriend } = useMutation(
    ["search-users"],
    searchUsers
  );
  const { mutateAsync: requestAddFriend } = useMutation(
    ["add-friend"],
    addFriend
  );

  const {
    data: userMessages,
    mutateAsync: requestFetchMessages,
    isLoading: isLoadingMessages,
  } = useMutation(["fetch-messages"], getMessagesByChatIds);
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
