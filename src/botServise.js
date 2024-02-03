import TelegramBotAPI from "node-telegram-bot-api";
import dotenv from "dotenv";
import { addUserToDatabase } from "./firebaseService.js";
import { createBoardListTrello } from "./trelloService.js";

dotenv.config();

const token = process.env.API_TOKEN_BOT;
export const bot = new TelegramBotAPI(token);

const webhookUrl = process.env.WEBHOOK_URL_TELEGRAM;
export let groupChatBotId = "-1002118628204";

const commands = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Greetings and register in database!",
    },
    {
      command: "/newlist",
      description: "Create new list in Trello",
    },
  ]);
};
commands();

export const startBot = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start" || text === "/start@ManagerTrelloBot") {
      await addUserToDatabase(chatId, msg.from.id, msg.from);

      await bot.sendMessage(
        chatId,
        `Hello, ${msg.from.first_name}! This is Trello_Bot 😎`
      );
    }

    if (text === "/newlist" || text === "/newlist@ManagerTrelloBot") {
      await createBoardListTrello("New List");
      await bot.sendMessage(chatId, `✅New List was created`);
    }

    return "I don't understand you";
  });
};

startBot();
bot.setWebHook(webhookUrl);

const showBoardCardAction = (action) => {
  return `🔷Board: ${action.data.board.name}
    🔹Card: ${action.data.card.name}
    🔹Action: ${action.type}`;
};

export const botMessageUpdateCard = async (action) => {
  await bot.sendMessage(
    groupChatBotId,
    `${showBoardCardAction(action)}
    🔹From: ${action.data.listBefore?.name || action.data.list?.name} list
    🔹To: ${action.data.listAfter?.name || action.data.list?.name} list
    🔹By user: ${action.memberCreator.fullName}`
  );
};

export const botMessageCreatedCard = async (action) => {
  await bot.sendMessage(
    groupChatBotId,
    `${showBoardCardAction(action)}
    🔹List: ${action.data.list.name}
    🔹By user: ${action.memberCreator.fullName}`
  );
};
