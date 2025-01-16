import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from './schema';
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle({ client: connection, schema, mode: "default"});

export { db };
