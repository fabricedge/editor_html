import {drizzle} from 'drizzle-orm/neon-http'
import {neon, neonConfig} from '@neondatabase/serverless'
import { desc, eq, sql as sqld } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL)
neonConfig.fetchConnectionCache = true;
const db = drizzle(sql, {schema})

export async function helloWorld() {
    const start = new Date() 
    const [dbResponse] = await sql`SELECT NOW();`
    const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ""
    const end = new Date()
    return {dbNow: dbNow, latency: Math.abs(end-start)}
}

