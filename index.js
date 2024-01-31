const TelegramBotAPI = require("node-telegram-bot-api");
require("dotenv").config();
const express = require("express");

const token = process.env.API_TOKEN_BOT;
const bot = new TelegramBotAPI(token);

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

bot.startPolling();
