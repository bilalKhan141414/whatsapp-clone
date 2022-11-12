import { BaseSocket } from "./base-socket";

export class SocketEmiter extends BaseSocket {
  emitFetchFriendStatus = (friendId, cb = () => {}) => {
    try {
      this.Socket.emit("friend status", friendId, cb);
    } catch (error) {
      console.log("checkFriendStatus", error);
    }
  };
  emitTypingStatus = (friendId, status, cb = () => {}) => {
    this.Socket.emit(
      "typing",
      {
        friendId,
        typing: status,
      },
      cb
    );
  };
  emitMessage = (message, cb = () => {}) => {
    this.Socket.emit("message", message, cb);
  };
}
