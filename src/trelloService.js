const createWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/tokens/${trelloAccessToken}/webhooks/`,
      {
        key: trelloAPIKey,
        idModel: trelloBoardId,
        callbackURL: trelloWebhookUrl,
      }
    );
    console.log("!Webhook created: ");
  } catch (error) {
    console.error("Error creating webhook:", error.response.data);
  }
};

const getAllWebhooksTrello = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/webhooks/65bbcf834ecc302283e379e9?key=${trelloAPIKey}&token=${trelloAccessToken}`,
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
      `https://api.trello.com/1/webhooks/65bbcf834ecc302283e379e9?key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "DELETE",
      }
    );
    console.log("TEXT: ", response.data);
  } catch (error) {
    console.log("error get hooks: ", error.response);
  }
};

export const createBoardListTrello = async () => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/boards/65ba1a7f2e02281113e213bd/lists?name={name}&key=${trelloAPIKey}&token=${trelloAccessToken}`,
      {
        method: "POST",
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

// createWebhook();
// getAllWebhooksTrello();
// deleteWebhooksTrello();
