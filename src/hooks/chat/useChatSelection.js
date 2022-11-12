/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import useChatMutations from "./useChatMutations";

export const useChatSelection = (userData, resetChat) => {
  const { queryString, setQueryString } = useQueryString();
  const { requestAddFriend, searchFriend } = useChatMutations();
  const [selectedUser, setSelectedUser] = useState(null);

  const isSearchResult = queryString?.search?.length > 0;

  const getSelectedUser = (friendId) =>
    userData?.find((user) => user._id === friendId);

  const handleChatSelection = (friendId) => {
    if (isSearchResult) {
      requestAddFriend(friendId);
    }
    setSelectedUser(getSelectedUser(friendId));
    setQueryString({
      friend: friendId,
    });
    resetChat();
  };

  useEffect(() => {
    if (queryString?.search?.length > 0) {
      searchFriend({ data: queryString?.search });
    }
    if (queryString?.friend?.length > 0) {
      setSelectedUser(getSelectedUser(queryString?.friend));
    }
  }, [queryString?.friend, queryString?.search]);

  return {
    selectedUser,
    handleChatSelection,
  };
};
