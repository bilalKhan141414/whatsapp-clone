import { v4 as uuid } from "uuid";
import { localStorageHelpers } from "../shared/Helpers/general";

export class MessageDto {
  constructor(text, from, to, chatId) {
    this.id = uuid();
    this.text = text;
    this.from = from;
    this.to = to;
    this.chatId = chatId;
    this.isReply = this.from === localStorageHelpers.User.id;
    this.date = new Date().getTime();
  }
  get ServerMessage() {
    return {
      id: this.id,
      text: this.text,
      from: this.from,
      to: this.to,
      date: this.date,
      chatId: this.chatId,
    };
  }
}
