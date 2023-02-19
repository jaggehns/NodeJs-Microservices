import express, { Request, Response } from "express";
const amqp = require("amqplib");
import MessageModel from "../models/message";

const { randomBytes } = require("crypto");

const router = express.Router();

router.get("/api/message", (req: Request, res: Response) => {
  MessageModel.find({}, (err: any, message: any) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(message);
  });
});

router.post("/api/message", async (req: Request, res: Response) => {
  const { message } = req.body;
  const messageId = randomBytes(4).toString("hex");
  const messageData = { message, messageId };

  try {
    const newMessage = new MessageModel(messageData);
    await newMessage.save();
    console.log("Saved Message to DB");

    const connection = await amqp.connect("amqp://rabbitmq-service:5672");
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();
    console.log("Created RabbitMQ channel");
    await channel.assertExchange("message-exchange", "topic", {
      durable: false,
    });
    await channel.publish(
      "message-exchange",
      "messi",
      Buffer.from(JSON.stringify(messageData))
    );
    console.log("Published to RabbitMQ");
    res.status(201).send(messageData);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router };
