import { io } from "socket.io-client";
import { localStorageHelpers } from "../../shared/Helpers/general";
import { SocketReactHelpers } from "./socket-react-handlers";
const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL_LIVE
    : process.env.REACT_APP_URL;

const socket = Symbol();

export class BaseSocket {
  [socket] = io(ENDPOINT, {
    autoConnect: false,
  });
  get Socket() {
    return this[socket];
  }

  init = (handlers) => {
    this.react = new SocketReactHelpers(handlers);
  };

  connect = () => {
    this.Socket.auth = { accessToken: localStorageHelpers.AuthToken };
    this.Socket.connect();
  };
}
