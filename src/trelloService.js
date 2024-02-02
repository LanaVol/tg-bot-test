import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const trelloAPIKey = process.env.TRELLO_API_KEY;
export const trelloAccessToken = process.env.TRELLO_ACCESS_TOKEN;
export const trelloBoardId = process.env.TRELLO_ID_BOARD;

const newTrelloWebhookUrl =
  "https://6eeb-176-37-48-101.ngrok-free.app/trello-webhook";

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
    console.log("!Webhook created: ", response.data);
  } catch (error) {
    console.error("Error creating webhook:", error);
  }
};

// const updateTrelloWebhook = async () => {
//   try {
//     const response = await axios.put(
//       `https://api.trello.com/1/webhooks/65bbda626a66d844ca0c79f9`,
//       {
//         key: trelloAPIKey,
//         token: trelloAccessToken,
//         callbackURL: newTrelloWebhookUrl,
//       },
//       {
//         method: "PUT",
//         headers: {
//           Accept: "application/json",
//         },
//       }
//     );

//     console.log("Webhook updated:", response.data);
//   } catch (error) {
//     console.error("Error updating webhook:", error.response.data);
//   }
// };
// updateTrelloWebhook();

const getAllWebhooksTrello = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/3/webhooks/65bcd881e6e666eba39303cb?key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error get hooks: ", error.response);
  }
};

const deleteWebhooksTrello = async () => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/webhooks/65bce141e3b48905eb9758a6?key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "DELETE",
      }
    );
    console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error delete hooks: ", error.response);
  }
};

const getWebhooks = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/tokens/${trelloAccessToken}/webhooks?key=${trelloAPIKey}`
    );

    console.log("Webhooks:", response.data);
  } catch (error) {
    console.error(
      "Error getting webhooks:",
      error.response ? error.response.data : error.message
    );
  }
};

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
    console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error create board list: ", error.response);
  }
};

// createWebhook();
// getAllWebhooksTrello();
// getWebhooks();
// deleteWebhooksTrello();
