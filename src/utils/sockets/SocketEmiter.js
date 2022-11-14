import { EVENTS } from "../../constants/events.constant";
import { BaseSocket } from "./base-socket";

export class SocketEmiter extends BaseSocket {
  emitFetchFriendStatus = (friendId, cb = () => {}) => {
    try {
      this.Socket.emit(EVENTS.FRIEND_STATUS, friendId, cb);
    } catch (error) {
      console.log("checkFriendStatus", error);
    }
  };
  emitTypingStatus = (friendId, status, cb = () => {}) => {
    this.Socket.emit(
      EVENTS.TYPING,
      {
        friendId,
        typing: status,
      },
      cb
    );
  };
  emitMessage = (message, cb = () => {}) => {
    this.Socket.emit(EVENTS.MESSAGE, message, cb);
  };
  emitMessageStatus = (data, cb = () => {}) => {
    this.Socket.emit(EVENTS.MESSAGE_ACKNOWLEDGEMENT, data, cb);
  };
}
