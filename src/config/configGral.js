import dotenv from "dotenv"

dotenv.config({ path:"./.env", override:true })

export const configGral={
  PORT:process.env.PORT,
  BASE_URL:process.env.BASE_URL,
  MONGODB_URI:process.env.MONGODB_URI,
  SECRET:process.env.SECRET,
  DB_NAME:process.env.DB_NAME,
}