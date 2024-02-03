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

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "trello-bot-project",
  storageBucket: "trello-bot-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const addUserToDatabase = async (chatId, userId, user) => {
  const dbRef = ref(database, "/users");
  const queryRef = query(dbRef, orderByChild("id"), equalTo(userId));

  const snapshot = await get(queryRef);
  const isExist = snapshot.exists();

  if (isExist) {
    await bot.sendMessage(chatId, "✅You are already registered in database!");
  } else {
    const userRef = child(dbRef, userId.toString());
    await set(userRef, {
      id: userId,
      name: `${user.first_name} ${user.last_name}`,
    });
  }
};
