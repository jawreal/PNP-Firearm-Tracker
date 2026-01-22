import dotenv from "dotenv";
dotenv.config();
import app from "@/App";
import { ConnectDB } from "@/config/dbConfig";
const PORT = process.env.PORT || 3000;

(async () => {
  await ConnectDB();
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  })
})()