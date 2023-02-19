import { Schema, model } from "mongoose";

interface Query {
  message: string;
  messageId: string;
  peeps: [{ peep: string; peepId: string }];
}

const schema = new Schema<Query>({
  message: { type: String, required: true },
  messageId: { type: String, required: true },
  peeps: { type: [{ peep: String, peepId: String }], required: true },
});

const QueryModel = model<Query>("Query", schema);

export default QueryModel;
