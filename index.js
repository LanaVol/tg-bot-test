import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  bot,
  botMessageCreatedCard,
  botMessageUpdateCard,
} from "./src/botServise.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

/**
 * Handle incoming Telegram webhook updates.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/telegram-webhook", async (req, res) => {
  const { body } = req;
  bot.processUpdate(body);

  res.status(200).send(body);
});

/**
 * Provide information for a GET request to /telegram-webhook.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/telegram-webhook", async (req, res) => {
  res.json({ message: "data" });
});

/**
 * Handle a HEAD request to /trello-webhook.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.head("/trello-webhook", async (req, res) => {
  res.status(200).json({ message: "trello" });
});

/**
 * Handle incoming Trello webhook updates.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

/**
 * Start the Express server.
 */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
