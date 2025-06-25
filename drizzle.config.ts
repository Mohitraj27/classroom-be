// drizzle.config.ts
import { config } from "dotenv";
config();
import { env } from "./src/config/env";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/modules/**/*.model.ts", 
  dialect: "mysql",
  dbCredentials: {
    host: env.db.host,
    port: Number(env.db.port),
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
  },
});

// alt shift a 


/* 
command for generating migrations-- npx drizzle-kit generate
 command for running migrations-- npx drizzle-kit push
 command for applying migrations-- npx drizzle-kit migrate
*/