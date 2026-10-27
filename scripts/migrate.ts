import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closeDbPool, dbPool } from "../packages/shared/src/database/db";

config({ path: resolve(process.cwd(), ".env") });
async function migrate() {
  const file = process.argv[2] ?? "sql/001_users.sql";
  const sql = readFileSync(resolve(process.cwd(), file), "utf-8");

  const pool = dbPool();
  await pool.query(sql);

  console.log("Migrated: ", file);
  await closeDbPool();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
