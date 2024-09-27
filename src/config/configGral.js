import dotenv from "dotenv"

dotenv.config({ path:"./.env", override:true })

export const configGral={
  PORT:process.env.PORT,
  BASE_URL:process.env.BASE_URL,
  MONGODB_URI:process.env.MONGODB_URI,
  SECRET:process.env.SECRET,
  MONGO_URL:process.env.MONGO_URL,
  DB_NAME:process.env.DB_NAME,
  CLIENT_ID:process.env.CLIENT_ID,
  CLIENT_SECRET:process.env.CLIENT_SECRET,
  CALLBACK_URL:process.env.CALLBACK_URL
}