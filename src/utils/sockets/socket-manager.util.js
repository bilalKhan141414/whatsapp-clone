import { SocketEmiter } from "./SocketEmiter";

class SocketManager extends SocketEmiter {
  constructor() {
    super();
    this.Socket.on("connect", this.#handleConnect);
    this.Socket.on("disconnect", this.#handleDisconnect);
  }
  #handleConnect = () => {
    this.Socket.onAny(this.#handleOnAny);
    this.Socket.on("connect_error", this.#handleOnConnectError);
    this.Socket.on("user connected", this.#handleUserConnected);
    this.Socket.on("friend status", this.#handleFriendOnlineStatus);
    this.Socket.on("typing", this.#handleTyping);
    this.Socket.on("message", this.#handleMessage);
    this.Socket.on("connected users", this.#handleConnectedUsersList);
  };
  #handleDisconnect = (reason) => {
    console.log("Socket Disconnected::", reason);
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      this.Socket.connect();
    }
  };
  #handleMessage = (message) => {
    this.react.handleSetMessage(message);
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
