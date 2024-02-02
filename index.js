import TelegramBotAPI from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createBoardListTrello } from "./src/trelloService.js";
import "firebase/database";
import { addUserToDatabase } from "./src/firebaseService.js";
import {
  bot,
  botMessageCreatedCard,
  botMessageUpdateCard,
  groupChatBotId,
} from "./src/botServise.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/telegram-webhook", async (req, res) => {
  const { body } = req;
  bot.processUpdate(body);

  res.sendStatus(200);
});

app.get("/telegram-webhook", async (req, res) => {
  res.json({ message: "data" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.head("/trello-webhook", async (req, res) => {
  console.log("HEAD trello-webhook");
  res.status(200).json({ message: "trello" });
});

app.post("/trello-webhook", async (req, res) => {
  const { body } = req;
  const action = body.action;

  console.log("+++", action.data);

  if (action.type === "updateCard" && action.data.listBefore) {
    await botMessageUpdateCard(action);
  } else if (action.type === "createCard") {
    await botMessageCreatedCard(action);
  }

  res.sendStatus(200);
});
