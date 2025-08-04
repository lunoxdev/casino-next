import postgres from "postgres";

const connectionString = process.env.POSTGRES_DATABASE;
const sql = postgres(connectionString, {
  ssl: "require", //
});

export default sql;
