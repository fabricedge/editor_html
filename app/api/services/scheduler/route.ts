import { NextResponse } from "next/server";

import { db } from "../../../lib/db";

import { pagesTable } from "../../../lib/schema";
// var cron = require('node-cron');
import cron from 'node-cron';
export async function GET() {

    try {

        console.log("");
        console.log("######################################");
        console.log("#                                    #");
        console.log("# running at 06:15:00 every day    #");
        console.log("#                                    #");
        console.log("######################################");
        console.log("");


        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}