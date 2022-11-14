import { v4 as uuid } from "uuid";

export class MessageDto {
  constructor(text, from, to) {
    this.id = uuid();
    this.text = text;
    this.from = from;
    this.to = to;
    this.date = new Date();
  }
  get ServerMessage() {
    return {
      id: this.id,
      text: this.text,
      from: this.from,
      to: this.to,
      date: this.date,
      allowScroll: true,
    };
  }
}
