export class SocketReactHelpers {
  constructor(handlers) {
    this.setConnected = handlers.setConnected;
    this.setTyping = handlers.setTyping;
    this.handleSetMessage = handlers.handleSetMessage;
    this.updateStatus = handlers.updateStatus;
    this.setIsSelectedUserOnline = handlers.setIsSelectedUserOnline;
  }
}
