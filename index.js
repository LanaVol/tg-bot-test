import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  bot,
  botMessageCreatedCard,
  botMessageUpdateCard,
} from "./src/botServise.js";
import { startBot } from "./src/botServise.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/telegram-webhook", async (req, res) => {
  const { body } = req;
  bot.processUpdate(body);
  await startBot();

  res.sendStatus(200);
});

app.get("/telegram-webhook", async (req, res) => {
  res.json({ message: "data" });
});

app.head("/trello-webhook", async (req, res) => {
  console.log("HEAD trello-webhook");
  res.status(200).json({ message: "trello" });
});

app.post("/trello-webhook", async (req, res) => {
  const { body } = req;
  const action = body.action;

  if (action.type === "updateCard" && action.data.listBefore) {
    await botMessageUpdateCard(action);
  } else if (action.type === "createCard") {
    await botMessageCreatedCard(action);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
