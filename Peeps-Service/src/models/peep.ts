import { Schema, model } from "mongoose";

interface Peep {
  messageId: string;
  peeps: [{ peep: string; peepId: string }];
}

const schema = new Schema<Peep>({
  messageId: { type: String, required: true },
  peeps: [{ type: String, peepId: String }],
});

const PeepModel = model<Peep>("Peep", schema);

export default PeepModel;
