import TelegramBotAPI from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const filename = "data.json";

function saveDataToJsonFile(filename, data) {
  // const jsonData = JSON.stringify(data, null, 2);

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

const dataBase = [];
const token = process.env.API_TOKEN_BOT;
const bot = new TelegramBotAPI(token);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const webhookUrl = "https://7721-176-37-48-101.ngrok-free.app/telegram-webhook";
// const webhookUrl = "https://tg-bot-test-neon.vercel.app/telegram-webhook";

bot.setWebHook(webhookUrl);

// app.post("/telegram-webhook", (req, res) => {
//   const { body } = req;

//   bot.processUpdate(body);
//   res.sendStatus(200).json({ message: body });
//   console.log("Success");
//   bot.on("text", async (msg) => {
//     const text = msg.text;
//     const chatId = msg.chat.id;

//     if (text === "/start") {
//       bot.sendMessage(chatId, "Hello! This is Bot-tester");
//     }
//     if (text === "/info") {
//       bot.sendMessage(
//         chatId,
//         `Your name is ${msg.from.first_name} ${msg.from.last_name}`
//       );
//     }
//     console.log("Received text message:", msg);
//   });
// });
app.post("/telegram-webhook", (req, res) => {
  const { body } = req;
  bot.processUpdate(body);
  const dataToSave = { [body.update_id]: `${body.message.text}` };
  saveDataToJsonFile(filename, dataToSave);
  console.log("body: ", body);

  // const chatId = body.message.chat.id;

  // bot.sendMessage(
  //   chatId,
  //   `Your name is ${body.message.text} ${JSON.stringify(
  //     readDataFromJsonFile(filename)
  //   )}`
  // );

  res.json({ message: body });
});

bot.on("text", (msg) => {
  console.log("***", msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    bot.sendMessage(chatId, "Hello! This is Bot-tester");
  }
  if (text === "/info") {
    bot.sendMessage(chatId, `You wrote ${text}`);
  }
  if (text) {
    bot.sendMessage(chatId, `You wrote ${text}`);
  }
});

app.get("/telegram-webhook", (req, res) => {
  res.json({ message: "Hello" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
