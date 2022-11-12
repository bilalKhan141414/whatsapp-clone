export class SendMessageSocketHandlersDto {
  constructor(handlers) {
    this.emitTypingStatus = handlers.emitTypingStatus;
    this.handleSetMessage = handlers.handleSetMessage;
  }
}
