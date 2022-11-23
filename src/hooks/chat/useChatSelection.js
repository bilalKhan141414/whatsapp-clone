/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import useChatMutations from "./useChatMutations";

export const useChatSelection = (
  userDetails,
  resetChat,
  refetch,
  selectedUser,
  setSelectedUser
) => {
  const [isSelectedUserOnline, setIsSelectedUserOnline] = useState(false);
  const [isAddingFrined, setIsAddingFriend] = useState(false);
  const userDataRef = useRef(null);

  const { queryString, setQueryString, removeFromQueryString } =
    useQueryString();
  const { users, requestAddFriend, searchFriend } = useChatMutations();

  const isSearchResult = queryString?.search?.length > 0;
  const userData = isSearchResult ? users?.data : userDetails?.friends;

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  const getSelectedUser = (friendId) =>
    userDataRef.current?.find((user) => user._id === friendId);

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
  const removeSelectedUser = () => {
    setSelectedUser(null);
    removeFromQueryString("friend");
    resetChat();
  };
  useEffect(() => {
    if (isSearchResult) {
      searchFriend({ data: queryString?.search });
    }
    if (
      !isSearchResult &&
      queryString?.friend?.length > 0 &&
      userDataRef.current
    ) {
      setSelectedUser(getSelectedUser(queryString?.friend));
    }
  }, [
    queryString?.friend,
    queryString?.search,
    userDataRef.current,
    isSearchResult,
  ]);

  return {
    userData,
    users,
    isSearchResult,
    isSelectedUserOnline,
    setIsSelectedUserOnline,
    isAddingFrined,
    removeSelectedUser,
    handleChatSelection,
  };
};
