import express, { Request, Response } from "express";
import { Mongoose } from "mongoose";
const amqp = require("amqplib");
import PeepModel from "../models/peep";

const { randomBytes } = require("crypto");

const router = express.Router();

router.get("/api/peeps/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  PeepModel.find({ messageId: messageId }, (err: any, peeps: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(peeps);
    }
  });
});

router.post("/api/peeps/:messageId", async (req: Request, res: Response) => {
  const { peep } = req.body;
  const peepId = randomBytes(4).toString("hex");
  const messageId = req.params.messageId;
  const peepData = { peep: peep, peepId: peepId };
  const msg = { peep: peep, peepId: peepId, messageId: messageId };

  try {
    await PeepModel.updateOne(
      { messageId: messageId },
      { $push: { peeps: peepData } }
    );
    console.log(`Peep ${peepId} saved to message ${messageId}`);

    const amqpConnection = await amqp.connect("amqp://rabbitmq-service:5672");
    console.log("Peeps API connected to RabbitMQ");
    const channel = await amqpConnection.createChannel();
    await channel.assertExchange("message-exchange", "topic", {
      durable: false,
    });
    console.log("Exchange created");
    await channel.publish(
      "message-exchange",
      "peep",
      Buffer.from(JSON.stringify(msg))
    );
    console.log("Peep published to RabbitMQ");
    res.status(201).send(peepData);
  } catch (error) {
    res.status(500).send("error " + error);
  }
});

export { router };
