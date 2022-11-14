import { EVENTS, MESSAGE_STATUS } from "../../constants/events.constant";
import { decode } from "../encoder.util";
import { SocketEmiter } from "./SocketEmiter";

class SocketManager extends SocketEmiter {
  constructor() {
    super();
    this.Socket.on(EVENTS.CONNECT, this.#handleConnect);
    this.Socket.on(EVENTS.DISCONNECT, this.#handleDisconnect);
  }
  #handleConnect = () => {
    this.Socket.onAny(this.#handleOnAny);
    this.Socket.on(EVENTS.CONNECT_ERROR, this.#handleOnConnectError);
    this.Socket.on(EVENTS.USER_CONNECTED, this.#handleUserConnected);
    this.Socket.on(EVENTS.FRIEND_STATUS, this.#handleFriendOnlineStatus);
    this.Socket.on(EVENTS.TYPING, this.#handleTyping);
    this.Socket.on(EVENTS.MESSAGE, this.#handleMessage);
    this.Socket.on(EVENTS.CONNECTED_USERS, this.#handleConnectedUsersList);
    this.Socket.on(EVENTS.MESSAGE_SAVED, this.#handleMessageSavedInDb);
    this.Socket.on(
      EVENTS.MESSAGE_ACKNOWLEDGEMENT,
      this.#handleMessageReceivedAcknowledgement
    );
    this.Socket.on(
      EVENTS.MESSAGE_BULK_ACKNOWLEDGEMENT,
      this.#handleMessageBulkAcknowledgement
    );
  };
  #handleDisconnect = (reason) => {
    console.log("Socket Disconnected::", reason);
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      this.Socket.connect();
    }
  };
  #handleMessageReceivedAcknowledgement = ({ id, status }) => {
    this.react.updateStatus(id, status);
  };
  #handleMessageBulkAcknowledgement = ({ ids, status }) => {
    this.react.updateStatus(ids, status);
  };
  #handleMessageSavedInDb = (savedMessage) => {
    console.log(decode(savedMessage));
  };
  #handleMessage = (message, cb) => {
    const decodedMsg = decode(message);
    this.react.handleSetMessage({
      ...decodedMsg,
      status: MESSAGE_STATUS.RECEIVED,
    });
    cb(MESSAGE_STATUS.RECEIVED);
    // this.emitMessageStatus({
    //   id: decodedMsg.from,
    //   status: MESSAGE_STATUS.RECEIVED,
    // });
  };
  #handleTyping = (typing) => {
    this.react.setTyping(typing);
  };
  #handleFriendOnlineStatus = (status) => {
    console.log("status::", status);
  };
  #handleConnectedUsersList = (users) => {};
  #handleUserConnected = (user) => {
    console.log("handleUserConnected::", user);
  };
  #handleOnAny = (event, ...args) => {
    console.log(event, args);
  };
  #handleOnConnectError = (err) => {
    console.log(err);
    if (err.message === "invalid user") {
      this.error.invalideUser = true;
    }
  };
  cleanUp() {
    this.Socket.off("connect_error");
  }
}

export const socketManager = new SocketManager();
