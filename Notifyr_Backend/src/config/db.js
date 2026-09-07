import mysql from "mysql2/promise";
import fs from "fs";
import env from "./env.js";

// Single pooled connection — never one raw connection per request.
// Aiven free tier has a modest max_connections cap, so keep this low.
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(env.DB_CA_PATH),
    rejectUnauthorized: true,
  },
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
});

export async function assertDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
    console.log("MySQL connection OK");
  } finally {
    conn.release();
  }
}

export default pool;
