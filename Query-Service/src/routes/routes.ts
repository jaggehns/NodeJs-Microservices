import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/message/get", (req: Request, res: Response) => {
  console.log("Message is working");
  res.send({ greeting: "Hello" });
});

router.post("/api/message/post", (req: Request, res: Response) => {});

export { router };
