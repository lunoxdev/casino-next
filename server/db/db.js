import pg from "pg";
const { Pool } = pg;

console.log("🔧 Initializing DB pool...");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("❌ Pool error:", err);
});

export default pool;
