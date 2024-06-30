import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env.local') });

const { DATABASE_URL } = process.env
 if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
} 
const sql = postgres(DATABASE_URL, {
    ssl: false,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30
});

export default sql;
