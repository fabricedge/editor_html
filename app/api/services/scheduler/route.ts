import { NextResponse } from "next/server";

import { db } from "../../../lib/db";

import { pagesTable } from "../../../lib/schema";
// var cron = require('node-cron');
import cron from 'node-cron';
export async function POST() {

    try {

        cron.schedule("0 45 */7 * *", async () => {
        console.log("");
        console.log("######################################");
        console.log("#                                    #");
        console.log("# Running scheduler every 7 days     #");
        console.log("#                                    #");
        console.log("######################################");
        console.log("");

        // // Example: check db for removable content and remove it
        // const page = await db
        //     .select()
        //     .from(pagesTable)
        //     .leftJoin(comments, eq(pagesTable.id, comments.post_id))
        //     .where(eq(pagesTable.nanoid, "yourNanoIdHere"))
        //     .limit(1);

        // console.log("Checked page:", page);
        });

        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}