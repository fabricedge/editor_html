import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {prismaAdapter} from 'better-auth/adapters/prisma'

export const auth = betterAuth({
    //...your config
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }
    },
    plugins: [nextCookies()] // make sure this is the last plugin in the array
})