import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
});

export async function query(
  text: string,
  params?: Array<string | number | null>,
): Promise<QueryResult<QueryResultRow>> {
  const client = await pool.connect();
  try {
    const res = await client.query<QueryResultRow>(text, params);
    return res;
  } finally {
    client.release();
  }
}
