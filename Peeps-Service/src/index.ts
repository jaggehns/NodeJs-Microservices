import express, { Router } from "express";
const amqp = require("amqplib");
import PeepModel from "./models/peep";

import mongoose from "mongoose";
import { router } from "./routes/routes";

async function processMessageMessage(msg: {
  content: { toString: () => any };
}) {
  const content = JSON.parse(msg.content.toString());
  const { messageId } = content;
  console.log(content);
  console.log(messageId);

  const peepData = {
    messageId: messageId,
    peeps: [],
  };

  try {
    const newPeep = new PeepModel(peepData);
    await newPeep.save();
    console.log("Saved message event to DB");
  } catch (error) {
    console.log(error);
  }
}

const app = express();
app.use(express.json());
app.use(router);

const Startup = async () => {
  try {
    await mongoose.connect("mongodb://message-mongo-service:27017/peep");
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

    await channel.assertQueue("peeps-messi-queue", { durable: false });
    await channel.bindQueue("peeps-messi-queue", "message-exchange", "messi.#");
    await channel.consume(
      "peeps-messi-queue",
      async (msg: { content: { toString: () => any } }) => {
        console.log("Processing message");
        await processMessageMessage(msg);
        await channel.ack(msg);
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }

  app.listen(5100, () => {
    console.log("Peeps-Service listening on port 5100");
  });
};

Startup();
