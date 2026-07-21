import { Pool, type QueryResult } from 'pg';

// Define the types for the query function parameters
type QueryParams = any[] | undefined;

const pool = new Pool({
  user: process.env.DB_USER, // Your database username
  password: process.env.DB_PASSWORD, // Your database password
  host: process.env.DB_HOST, // Database host (e.g., localhost or remote IP)
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined, // Database port (default: 5432)
  database: process.env.DB_NAME, // Your database name
});

// Define the return type for the query function
export const query = async (text: string, params: QueryParams = []): Promise<QueryResult> => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error: any) {
    throw new Error('Database query failed');
  }
};
