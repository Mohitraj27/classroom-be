import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "./env";

let db: ReturnType<typeof drizzle>;

async function initDb() {
  const pool = await mysql.createPool({
    host: env.db.host,
    user: env.db.user,
    database: env.db.name,
    password: env.db.password,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // Test connection
  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected");
  } catch (err) {
    console.error("❌ MySQL connection failed", err);
    process.exit(1);
  }

  db = drizzle(pool);
}

initDb();

export { db };

/* https://orm.drizzle.team/docs/get-started/mysql-new */