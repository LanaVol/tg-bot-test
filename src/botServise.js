import TelegramBotAPI from "node-telegram-bot-api";
import dotenv from "dotenv";
import { addUserToDatabase } from "./firebaseService.js";
import { createBoardListTrello } from "./trelloService.js";

dotenv.config();

/**
 * Telegram bot API token.
 * @type {string}
 */
const token = process.env.API_TOKEN_BOT;

/**
 * Instance of the Telegram bot.
 * @type {object}
 */
export const bot = new TelegramBotAPI(token);

/**
 * Webhook URL for Telegram.
 * @type {string}
 */
const webhookUrl = process.env.WEBHOOK_URL_TELEGRAM;

/**
 * Group chat ID for the bot.
 * @type {string}
 */
export let groupChatBotId = "-1002118628204";

/**
 * Set bot commands on startup.
 * @returns {void}
 */
const commands = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Greetings and register in the database!",
    },
    {
      command: "/newlist",
      description: "Create a new list in Trello",
    },
  ]);
};
commands();

/**
 * Start the Telegram bot and set up event listeners.
 * @returns {void}
 */
export const startBot = () => {
  bot.on("message", async (msg) => {
    /**
     * Text content of the received message.
     * @type {string}
     */
    const text = msg.text;

    /**
     * Chat ID of the received message.
     * @type {number}
     */
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

/**
 * Set up the Telegram bot webhook.
 * @returns {void}
 */
bot.setWebHook(webhookUrl);

/**
 * Show information about board and card actions.
 * @param {object} action - Action object from Trello.
 * @returns {string} - Formatted string with board and card action details.
 */
const showBoardCardAction = (action) => {
  return `🔷Board: ${action.data.board.name}
    🔹Card: ${action.data.card.name}
    🔹Action: ${action.type}`;
};

/**
 * Send a Telegram message for the "updateCard" action.
 * @param {object} action - Action object from Trello.
 * @returns {void}
 */
export const botMessageUpdateCard = async (action) => {
  await bot.sendMessage(
    groupChatBotId,
    `${showBoardCardAction(action)}
    🔹From: ${action.data.listBefore?.name || action.data.list?.name} list
    🔹To: ${action.data.listAfter?.name || action.data.list?.name} list
    🔹By user: ${action.memberCreator.fullName}`
  );
};

/**
 * Send a Telegram message for the "createCard" action.
 * @param {object} action - Action object from Trello.
 * @returns {void}
 */
export const botMessageCreatedCard = async (action) => {
  await bot.sendMessage(
    groupChatBotId,
    `${showBoardCardAction(action)}
    🔹List: ${action.data.list.name}
    🔹By user: ${action.memberCreator.fullName}`
  );
};
