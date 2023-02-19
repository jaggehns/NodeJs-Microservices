import express from "express";
const amqp = require("amqplib");
import QueryModel from "./models/query";
import mongoose from "mongoose";
import { router } from "./routes/routes";

const app = express();
app.use(express.json());
app.use(router);

async function processPeepMessage(msg: { content: { toString: () => any } }) {
  const content = JSON.parse(msg.content.toString());
  const { peep, peepId, messageId } = content;
  console.log(peep, peepId, messageId);
  const peepData = { peep: peep, peepId: peepId };
  await mongoose
    .model("Query")
    .updateOne({ messageId: messageId }, { $push: { peeps: peepData } });
  console.log("Saved peep to DB");
}

async function processMessageMessage(msg: {
  content: { toString: () => any };
}) {
  const content = JSON.parse(msg.content.toString());
  const { message, messageId } = content;
  console.log(message, messageId);

  const queryData = {
    message: message,
    messageId: messageId,
    peeps: [],
  };

  try {
    const newQuery = new QueryModel(queryData);
    await newQuery.save();
    console.log("Saved message event to DB");
  } catch (error) {
    console.log(error);
  }
}

const Startup = async () => {
  try {
    await mongoose.connect("mongodb://message-mongo-service:27017/query");
    console.log("connected to mongo");

    const amqpConnection = await amqp.connect(
      "amqp://rabbitmq-service:5672",
      "heartbeat=30"
    );
    console.log("Peeps connected to RabbitMQ");
    const channel = await amqpConnection.createChannel();
    await channel.assertExchange("message-exchange", "topic", {
      durable: false,
    });
    console.log("Exchange created");

    await channel.assertQueue("query-peep-queue", { durable: false });
    await channel.bindQueue("query-peep-queue", "message-exchange", "peep.#");
    await channel.consume(
      "query-peep-queue",
      async (msg: { content: { toString: () => any } }) => {
        console.log("Processing message");
        await processPeepMessage(msg);
        await channel.ack(msg);
      },
      { noAck: false }
    );
    await channel.assertQueue("query-messi-queue"), { durable: false };
    await channel.bindQueue("query-messi-queue", "message-exchange", "messi.#");
    await channel.consume(
      "query-messi-queue",
      async (msg: { content: { toString: () => any } }) => {
        console.log("Processing message");
        await processMessageMessage(msg);
        await channel.ack(msg);
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log(error);
  }

  app.listen(5200, () => {
    console.log("Query-Service listening on port 5200");
  });
};

Startup();
