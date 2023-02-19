import { Schema, model } from "mongoose";

interface Message {
  message: string;
  messageId: string;
}

const schema = new Schema<Message>({
  message: { type: String, required: true },
  messageId: { type: String, required: true },
});

const MessageModel = model<Message>("Message", schema);

export default MessageModel;
