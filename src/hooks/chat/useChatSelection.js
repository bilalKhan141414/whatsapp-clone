/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import useChatMutations from "./useChatMutations";

export const useChatSelection = (userDetails, resetChat, refetch) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSelectedUserOnline, setIsSelectedUserOnline] = useState(false);
  const [isAddingFrined, setIsAddingFriend] = useState(false);

  const { queryString, setQueryString, removeFromQueryString } =
    useQueryString();
  const { users, requestAddFriend, searchFriend } = useChatMutations();

  const isSearchResult = queryString?.search?.length > 0;
  const userData = isSearchResult ? users?.data : userDetails?.friends;

  const getSelectedUser = (friendId) =>
    userData?.find((user) => user._id === friendId);

  const handleChatSelection = async (friendId) => {
    if (isSearchResult) {
      setIsAddingFriend(true);
      await requestAddFriend(friendId);
      await refetch();
      setIsAddingFriend(false);
    }
    setSelectedUser(getSelectedUser(friendId));
    setQueryString({
      friend: friendId,
    });
    removeFromQueryString("search");
    const inputEle = document.getElementById("user-search");
    if (inputEle) {
      inputEle.value = "";
    }
    selectedUser?._id !== friendId && resetChat();
  };

  useEffect(() => {
    if (queryString?.search?.length > 0) {
      searchFriend({ data: queryString?.search });
    }
    if (queryString?.friend?.length > 0 && userData) {
      setSelectedUser(getSelectedUser(queryString?.friend));
    }
  }, [queryString?.friend, queryString?.search, userData]);

  return {
    userData,
    users,
    isSearchResult,
    isSelectedUserOnline,
    setIsSelectedUserOnline,
    isAddingFrined,
    selectedUser,
    handleChatSelection,
  };
};
