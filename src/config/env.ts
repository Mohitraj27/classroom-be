import * as dotenv from "dotenv";
dotenv.config();


export const env = {
  port: process.env.PORT || 8080,
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
  },
};
