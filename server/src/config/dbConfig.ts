import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import session from "express-session";

const MongoDBSessionStore = MongoDBStore(session);
const store = new MongoDBSessionStore({
  uri: process.env.MONGODB_URI as string,
  collection: "sessions",
});

const ConnectDB = async (): Promise<void> => {
  try {
   //console.log(process.env.MONGODB_URI)
    await mongoose.connect(
      process.env.MONGODB_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export { ConnectDB, store };