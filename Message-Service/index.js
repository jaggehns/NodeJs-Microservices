const express = require("express");
const { randomBytes } = require("crypto");
const app = express();

app.use(express.json());

const messageData = {};

app.post("/message", (req, res) => {
  console.log(req.body);
  const id = randomBytes(8).toString("hex");
  const { title } = req.body;
  messageData[id] = { id, title };
  res.status(201).send(messageData[id]);
});

app.listen(5000, () => {
  console.log("Message-Service listening on port 5000");
});
