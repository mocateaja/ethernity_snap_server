import postgres from 'postgres';
/* import 'dotenv/config'; */

const connectionString = 'postgres://postgres.nhdextjtuhcgeavdtxxv:OWrbZGwcxT5rdP1s@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
/* if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
} */
const sql = postgres(connectionString, {
    ssl: false,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30
});

export default sql;
