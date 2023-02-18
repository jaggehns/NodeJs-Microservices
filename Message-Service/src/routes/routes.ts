import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/message/get", (req: Request, res: Response) => {
  console.log("Message is working");
});

router.post("/api/message/post", (req: Request, res: Response) => {});

export { router };
