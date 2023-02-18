import express, { Router } from "express";
import mongoose from "mongoose";
import { router } from "./routes/routes";

const app = express();
app.use(express.json());
app.use(router);

const Startup = async () => {
  try {
    await mongoose.connect("mongodb://message-mongo-service:27017/message");
    console.log("connected to mongo");
  } catch (error) {
    console.log(error);
  }

  app.listen(5000, () => {
    console.log("Message-Service listening on port 5000");
  });
};

Startup();
