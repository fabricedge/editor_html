import { NextResponse } from "next/server";

// var cron = require('node-cron');
import cron from 'node-cron';
export async function POST() {

    try {

        cron.schedule('*/59 * * * *', async () => {

            console.log('')
            console.log('######################################')
            console.log('#                                    #')
            console.log('# Running scheduler every 59 minutes #')
            console.log('#                                    #')
            console.log('######################################')
            console.log('')
            // todo: check db for removable content and remove it
            // Perform your action here
        });

        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}