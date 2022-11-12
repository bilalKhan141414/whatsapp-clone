/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import io from "socket.io-client";
import queryString from "query-string";
import { encode, decode } from "./../../utils/encoder.util";
import { localStorageHelpers } from "./../Helpers/general";

let socket = null;
export default function useSocket() {
  window.myChat = { socket };
  const [newMessage] = useState(null);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // const ENDPOINT = 'https://chat-app-server-node.herokuapp.com/'
  const ENDPOINT =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_URL_LIVE
      : process.env.REACT_APP_URL;

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT, {
      autoConnect: false,
      query: {
        name,
        room,
      },
    });
    window.myChat = { socket };

    setName(name);
    setRoom(room);
    join({ accessToken: localStorageHelpers.AuthToken, name, room }, (data) => {
      console.log(data, " from join ");
    });
    socket.on("message", (message) => {
      message = decode(message);
      let foramtedMessage =
        message.user === "admin" ? message : JSON.parse(message.text);
      let messageToSave = {
        ...foramtedMessage,
        incomming: true,
      };

      console.log("decoded", messageToSave);
      // dispatch(addMsg({message: messageToSave}));
    });
    return () => {
      socket.emit("diconnect");
      socket.off();
    };
  }, []);

  const join = (data, callback) => {
    socket.emit("join", data, callback);
  };
  const broadCastMessage = (message, callback) => {
    console.log("encode(message)", message, encode(message));
    socket.emit("sendMessage", encode(message), callback);
  };
  const listenActiveStatus = (callback) => {
    socket.on("friendActiveStatus", (data) => {
      data = decode(data);
      console.log("data", data);
      callback(data.text.userId);
    });
  };
  return {
    listenActiveStatus,
    newMessage,
    name,
    room,
    join,
    broadCastMessage,
  };
}
