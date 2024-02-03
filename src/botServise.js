import TelegramBotAPI from "node-telegram-bot-api";
import dotenv from "dotenv";
import { addUserToDatabase } from "./firebaseService.js";
import { createBoardListTrello } from "./trelloService.js";

dotenv.config();

const token = process.env.API_TOKEN_BOT;
export const bot = new TelegramBotAPI(token);

// const webhookUrl = "https://6eeb-176-37-48-101.ngrok-free.app/telegram-webhook";
const webhookUrl = "https://tg-bot-test-neon.vercel.app/telegram-webhook";
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

// export const startBot = () => {
//   bot.on("message", async (msg) => {
//     const text = msg.text;
//     const chatId = msg.chat.id;

//     if (text === "/start" || text === "/start@ManagerTrelloBot") {
//       await addUserToDatabase(chatId, msg.from.id, msg.from);

//       await bot.sendMessage(
//         chatId,
//         `Hello, ${msg.from.first_name}! This is Trello_Bot 😎`
//       );
//     }

//     if (text === "/newlist" || text === "/newlist@ManagerTrelloBot") {
//       await createBoardListTrello("New List");
//       await bot.sendMessage(chatId, `✅New List was created`);
//     }

//     // return "I don't understand you";
//   });
// };
export const startBot = async (update) => {
  console.log(update);
  // if (update) {
  //   const text = update.message.text;
  //   const chatId = update.message.chat.id;

  //   if (text === "/start" || text === "/start@ManagerTrelloBot") {
  //     await addUserToDatabase(chatId, update.from.id, update.from);

  //     return bot.sendMessage(
  //       chatId,
  //       `Hello, ${update.from.first_name}! This is Trello_Bot 😎`
  //     );
  //   }

  //   if (text === "/newlist" || text === "/newlist@ManagerTrelloBot") {
  //     await createBoardListTrello("New List");
  //     return bot.sendMessage(chatId, `✅New List was created`);
  //   }
  // }
};

// startBot();
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
