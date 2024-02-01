import TelegramBotAPI from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import { createBoardListTrello } from "./src/trelloService.js";

dotenv.config();

const filename = "data.json";

function saveDataToJsonFile(filename, data) {
  const values = readDataFromJsonFile(filename);

  const updatedValues = { ...values, ...data };

  fs.writeFileSync(filename, JSON.stringify(updatedValues), "utf8");
}

function readDataFromJsonFile(filename) {
  try {
    const jsonData = fs.readFileSync(filename, "utf8");

    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading data from ${filename}: ${error.message}`);
    return null;
  }
}

const token = process.env.API_TOKEN_BOT;
const trelloAPIKey = process.env.TRELLO_API_KEY;
const trelloAccessToken = process.env.TRELLO_ACCESS_TOKEN;
const trelloBoardId = process.env.TRELLO_ID_BOARD;
const bot = new TelegramBotAPI(token);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const webhookUrl = "https://1fc5-176-37-48-101.ngrok-free.app/telegram-webhook";
// const webhookUrl = "https://tg-bot-test-neon.vercel.app/telegram-webhook";
const trelloWebhookUrl =
  "https://1fc5-176-37-48-101.ngrok-free.app/trello-webhook";

const commards = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Greetings!",
    },
    {
      command: "/project",
      description: "Trello",
    },
    {
      command: "/newboard",
      description: "Trello",
    },
  ]);
};

bot.setWebHook(webhookUrl);

app.post("/telegram-webhook", (req, res) => {
  const { body } = req;
  bot.processUpdate(body);
  // const dataToSave = {
  //   [body.message.from
  //     .id]: `${body.message.from.first_name} ${body.message.from.last_name}`,
  // };

  // saveDataToJsonFile(filename, dataToSave);
  console.log("body: ", body);

  // res.sendStatus(200).json({ message: body });
  res.json({ message: body });
});

app.post("/trello-webhook", (req, res) => {
  const { body } = req;
  const action = body.action;
  // console.log("body: ", body);

  if (action.type === "updateCard") {
    bot.sendMessage(
      "-1002007843238",
      `Board: ${action.data.board.name}
      Card ${action.data.card.name}
      Action: ${action.type}
      FROM: ${action.data.listBefore.name}
      TO: ${action.data.listAfter.name}
      by ${action.memberCreator.fullName}`
    );
  } else if (action.type === "createCard") {
    bot.sendMessage(
      "-1002007843238",
      `Board: ${action.data.board.name}
      Card ${action.data.card.name}
      List ${action.data.list.name}
      Action: ${action.type}
      by ${action.memberCreator.fullName}`
    );
  }

  // res.json({ message: "body" });
});

const startBot = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    // console.log("***", chatId);
    const text = msg.text;

    if (text === "/start" || text === "/start@Project_1_testingBot") {
      return bot.sendMessage(
        chatId,
        `Hello, ${msg.from.first_name}! This is Bot-tester`
      );
    }

    if (text === "/project" || text === "/project@Project_1_testingBot") {
      return bot.sendMessage(chatId, `You wrote ${msg.date}`);
    }

    return "I don't understand you";
  });
};

app.get("/telegram-webhook", (req, res) => {
  const data = readDataFromJsonFile(filename);
  res.json({ message: data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

commards();
startBot();

const createNewBoardListFromBot = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/newboard" || text === "/newboard@Project_1_testingBot") {
      createBoardListTrello();
      return bot.sendMessage(chatId, `New List was created`);
    }
    return "I don't understand you";
  });
};

createNewBoardListFromBot();
