import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, {
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30
});

export default sql;
