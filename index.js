const TelegramBotAPI = require("node-telegram-bot-api");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const token = process.env.API_TOKEN_BOT;
const bot = new TelegramBotAPI(token);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const webhookUrl = "https://tg-bot-test-neon.vercel.app/telegram-webhook";

bot.setWebHook(webhookUrl);

app.post("/telegram-webhook", (req, res) => {
  const { body } = req;
  bot.processUpdate(body);
  res.sendStatus(200);
  console.log("Success");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

bot.on("text", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(chatId, "Hello! This is Bot-tester");
  }
  if (text === "/info") {
    bot.sendMessage(
      chatId,
      `Your name is ${msg.from.first_name} ${msg.from.last_name}`
    );
  }
});

// bot.startPolling();
