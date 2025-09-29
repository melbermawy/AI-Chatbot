import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "/Users/mohamed/Documents/fractal-fa25/Chatbot-test/app/db/db";
import * as schema from './app/db/auth-schema'
export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },  
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
});