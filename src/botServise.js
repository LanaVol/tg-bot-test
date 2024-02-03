import TelegramBotAPI from "node-telegram-bot-api";
import dotenv from "dotenv";
import { addUserToDatabase } from "./firebaseService.js";
import { createBoardListTrello } from "./trelloService.js";
import axios from "axios";

dotenv.config();

const token = process.env.API_TOKEN_BOT;
// const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
// const URL = "/telegram-webhook";
export const bot = new TelegramBotAPI(token);

// const webhookUrl = "https://6eeb-176-37-48-101.ngrok-free.app/telegram-webhook";
const webhookUrl = "https://tg-bot-test-neon.vercel.app/telegram-webhook";
// const webhookUrl = `https://tg-bot-test-neon.vercel.app${URL}`;
export let groupChatBotId = "-1002118628204";

const commands = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Greetings!",
    },
    {
      command: "/newlist",
      description: "Trello",
    },
  ]);
};
commands();

bot.setWebHook(webhookUrl);
// export const setupWebhook = async () => {
//   try {
//     const { data } = await axios.get(
//       `${TELEGRAM_API}/setWebhook?url=${webhookUrl}&drop_pending_updates=true`
//     );
//     console.log(data);
//   } catch (error) {
//     console.log("Error setting up webhook: ", error.message);
//   }
// };

// export const handleTelegramUpdate = async (update) => {
//   if (update.message && update.message.text) {
//     const text = update.message.text;
//     const chatId = update.message.chat.id;

//     if (text === "/start" || text === "/start@ManagerTrelloBot") {
//       await addUserToDatabase(chatId, update.from.id, update.from);

//       await bot.sendMessage(
//         chatId,
//         `Hello, ${update.from.first_name}! This is Trello_Bot 😎`
//       );
//     }

//     if (text === "/newlist" || text === "/newlist@ManagerTrelloBot") {
//       await createBoardListTrello("New List");
//       await bot.sendMessage(chatId, `✅New List was created`);
//     }
//   }
// };

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

    // return "I don't understand you";
  });
};

startBot();
bot.setWebHook(webhookUrl);

// const startBot = () => {
//   bot.on("message", async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     if (text === "/start" || text === "/start@ManagerTrelloBot") {
//       await addUserToDatabase(chatId, msg.from.id, msg.from);

//       return bot.sendMessage(
//         chatId,
//         `Hello, ${msg.from.first_name}! This is Trello_Bot 😎`
//       );
//     }

//     return "I don't understand you";
//   });
// };

// const createNewBoardListFromBot = () => {
//   bot.on("message", async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     if (text === "/newlist" || text === "/newlist@ManagerTrelloBot") {
//       await createBoardListTrello("New List");
//       return bot.sendMessage(chatId, `✅New List was created`);
//     }
//     return "I don't understand you";
//   });
// };

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

// startBot();
// createNewBoardListFromBot();
