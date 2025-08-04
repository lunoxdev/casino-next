import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_DATABASE,
  ssl: { rejectUnauthorized: false },
});

export default pool;
