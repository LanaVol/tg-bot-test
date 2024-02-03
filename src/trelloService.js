import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Trello API key obtained from Trello Developer Portal.
 * @type {string}
 */
const trelloAPIKey = process.env.TRELLO_API_KEY;

/**
 * Trello access token obtained after user authentication.
 * @type {string}
 */
const trelloAccessToken = process.env.TRELLO_ACCESS_TOKEN;

/**
 * Trello board ID where the webhook is attached.
 * @type {string}
 */
const trelloBoardId = process.env.TRELLO_ID_BOARD;

/**
 * Webhook URL for Trello to send updates to.
 * @type {string}
 */
const newTrelloWebhookUrl = process.env.TRELLO_WEBHOOK_URL;

/**
 * Create a webhook on Trello to receive updates.
 * @returns {Promise<void>}
 */
export const createWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/webhooks/?callbackURL=${newTrelloWebhookUrl}&idModel=${trelloBoardId}&key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );
    // console.log("!Webhook created: ", response.data);
  } catch (error) {
    console.error("Error creating webhook:", error.message);
  }
};

/**
 * Delete Trello webhooks.
 * @returns {Promise<void>}
 */
const deleteWebhooksTrello = async () => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/webhooks/65bd82ef6d877e235f1b5fde?key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "DELETE",
      }
    );
    console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error delete hooks: ", error.message);
  }
};

/**
 * Get Trello webhooks associated with the access token.
 * @returns {Promise<void>}
 */
const getWebhooks = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/tokens/${trelloAccessToken}/webhooks?key=${trelloAPIKey}`
    );

    // console.log("Webhooks:", response.data);
  } catch (error) {
    console.error(
      "Error getting webhooks:",
      error.response ? error.response.data : error.message
    );
  }
};

/**
 * Create a board list on Trello.
 * @param {string} name - Name of the board list to be created.
 * @returns {Promise<void>}
 */
export const createBoardListTrello = async (name) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/boards/65ba1a7f2e02281113e213bd/lists?name=${name}&key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );
    // console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error create board list: ", error.message);
  }
};

// createWebhook();
// getWebhooks();
// deleteWebhooksTrello();
