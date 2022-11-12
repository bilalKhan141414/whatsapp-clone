import { MessageDto } from "../dtos/MessageDto";
import { SendMessageSocketHandlersDto } from "../dtos/SendMessageSocketHandlersDto";
import { localStorageHelpers } from "../shared/Helpers/general";
import MessagesQueue from "../shared/Queues/MessagesQueue";

class SendMessageManager {
  shiftPress = false;
  userInputByFriend = {};
  messageQueue = new MessagesQueue();

  get friendLastInput() {
    return this.userInputByFriend[this.friendId];
  }
  init = (
    friendId,
    chatContainer,
    formElement,
    chatInputElement,
    socketHandlers
  ) => {
    this.friendId = friendId;
    this.chatContainer = chatContainer;
    this.formElement = formElement;
    this.chatInputElement = chatInputElement;
    this.socket = new SendMessageSocketHandlersDto(socketHandlers);
  };
  #setUserInputByFriend = (value) => {
    this.userInputByFriend[this.friendId] = value;
  };
  #manageTypingElement = (value) => {
    if (value.length > 0) {
      this.sendUserTyping();
    } else {
      this.sendUserNotTyping();
    }
  };
  #scrollToBottom = () => {
    setTimeout(() => {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    });
  };
  #sendMessage = (text) => {
    // this.messageQueue.enqueue(
    //   new MessageDto(text, localStorageHelpers.User.id, to)
    // );
    this.socket.handleSetMessage(
      new MessageDto(text, localStorageHelpers.User.id, this.friendId)
    );
    this.formElement.reset(0);
    this.#setUserInputByFriend("");
  };
  sendUserTyping = () => {
    if (!this.isTyping) {
      this.isTyping = !this.isTyping;
      this.socket.emitTypingStatus(this.friendId, true);
    }
  };
  sendUserNotTyping = (friendId) => {
    if (this.isTyping) {
      this.isTyping = !this.isTyping;
      this.socket.emitTypingStatus(friendId ?? this.friendId, false);
    }
  };
  handleKeyPress = (event) => {
    if (
      !this.shiftPress &&
      event.keyCode === 13 &&
      event.target.value.trim().length > 0
    ) {
      this.#sendMessage(event.target.value);
    }
  };
  handleOnSubmit = (event) => {
    event.preventDefault();
    if (this.chatInputElement.value.trim().length > 0) {
      this.#sendMessage(this.chatInputElement.value);
    }
  };
  handleOnChange = (e) => {
    const { value } = e.target;
    this.#setUserInputByFriend(value);
  };
  handleKeyUp = (event) => {
    this.#manageTypingElement(event.target.value);
    if (event.keyCode === 16) this.shiftPress = false;
  };
  handleKeyDown = (event) => {
    if (event.keyCode === 16) this.shiftPress = true;
  };
  handleOnMessageReceive = (data) => {
    this.#scrollToBottom();
  };
  handleOnFocus = (event) => this.#manageTypingElement(event.target.value);
  handleOnBlur = () => this.sendUserNotTyping();
}

export const sendMessageManager = new SendMessageManager();
