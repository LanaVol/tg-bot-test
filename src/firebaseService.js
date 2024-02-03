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
  authDomain: "trello-bot-project.firebaseapp.com",
  databaseURL: "https://trello-bot-project-default-rtdb.firebaseio.com",
  projectId: "trello-bot-project",
  storageBucket: "trello-bot-project.appspot.com",
  messagingSenderId: "294895283237",
  appId: "1:294895283237:web:60ee4853f517890b7463cc",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const addUserToDatabase = async (chatId, userId, user) => {
  const dbRef = ref(database, "/users");
  const queryRef = query(dbRef, orderByChild("id"), equalTo(userId));

  const snapshot = await get(queryRef);

  if (snapshot.exists()) {
    await bot.sendMessage(chatId, "✅You are already registered!");
  } else {
    const userRef = await child(dbRef, userId.toString());
    await set(userRef, {
      id: userId,
      name: `${user.first_name} ${user.last_name}`,
    });
  }
};
