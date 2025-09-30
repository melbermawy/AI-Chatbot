import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db/db"
import * as schema from '~/db/auth-schema'


export const auth =  betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"],
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: schema,
    }),
    secret: process.env.BETTER_AUTH_SECRET!
})