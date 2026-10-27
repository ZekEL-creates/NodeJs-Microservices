import { Pool } from "pg";

let pool: Pool | null = null;

export function dbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Connection string is not provided");
    }

    pool = new Pool({ connectionString: connectionString });
    return pool;
  }
  return pool;
}

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
