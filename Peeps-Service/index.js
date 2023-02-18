const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(express.json());

const peepsByMessageId = {};

app.post("/message/:id/peeps", (req, res) => {
  const peepId = randomBytes(8).toString("hex");
  const { peep } = req.body;
  const peeps = peepsByMessageId[req.params.id] || [];
  peeps.push({ id: peepId, peep });
  peepsByMessageId[req.params.id] = peeps;
  res.status(201).send(peeps);
});

app.get("/message/:id/peeps", (req, res) => {
  res.send(peepsByMessageId[req.params.id] || []);
});

app.listen(5100, () => {
  console.log("Peeps-Service listening on port 5100");
});
