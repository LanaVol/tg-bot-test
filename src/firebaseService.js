import { initializeApp } from "firebase/app";
import "firebase/database";
import {
  child,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
} from "firebase/database";
import { ref, set } from "firebase/database";
import { bot } from "./botServise.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Firebase configuration object.
 * @type {object}
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "trello-bot-project",
  storageBucket: "trello-bot-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

/**
 * Initialize Firebase app with the provided configuration.
 * @type {object}
 */
const firebase = initializeApp(firebaseConfig);

/**
 * Firebase database instance.
 * @type {object}
 */
const database = getDatabase(firebase);

/**
 * Add user information to the Firebase database.
 * @param {number} chatId - The chat ID associated with the user.
 * @param {number} userId - The unique identifier of the user.
 * @param {object} user - The user object containing first_name and last_name.
 * @returns {Promise<void>}
 */
export const addUserToDatabase = async (chatId, userId, user) => {
  /**
   * Reference to the "/users" node in the Firebase database.
   * @type {object}
   */
  const dbRef = ref(database, "/users");

  /**
   * Query reference to check if the user already exists in the database.
   * @type {object}
   */
  const queryRef = query(dbRef, orderByChild("id"), equalTo(userId));

  /**
   * Snapshot of the query result.
   * @type {object}
   */
  const snapshot = await get(queryRef);

  /**
   * Boolean indicating whether the user already exists in the database.
   * @type {boolean}
   */
  const isExist = snapshot.exists();

  if (isExist) {
    await bot.sendMessage(
      chatId,
      "✅You are already registered in the database!"
    );
  } else {
    /**
     * Reference to the specific user in the database.
     * @type {object}
     */
    const userRef = child(dbRef, userId.toString());

    /**
     * Set user information in the database.
     */
    await set(userRef, {
      id: userId,
      name: `${user.first_name} ${user.last_name}`,
    });
  }
};
