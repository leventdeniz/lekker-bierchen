import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle({ connection: { uri: process.env.DATABASE_URL }});

export { db };
