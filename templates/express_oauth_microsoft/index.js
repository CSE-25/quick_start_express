import { configDotenv } from 'dotenv'
// configDotenv({ path: "./templates/express_oauth_microsoft/.env" }) // Use when testing the tool
configDotenv({ path: "./.env" }) // use when testing the template

import express from 'express'
import passport from 'passport'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { appendFileSync } from 'fs';

import { authRouter } from './router/authRouter.js'
import { appRouter } from './router/appRouter.js'
import { initLog } from './logs/logsInit.js'

// for testing
// console.log(process.env.MICROSOFT_CLIENT_ID)
// console.log(process.env.MICROSOFT_CLIENT_SECRET)

// microsoft auth middleware
passport.use(new MicrosoftStrategy({
    callbackURL: process.env.MICROSOFT_CALLBACK_URL || `http://localhost:3000/auth/microsoft/redirect`,
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    scope: ['openid', 'profile', 'email'],
    tenant: process.env.MICROSOFT_TENANT_ID
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || 'No email available'
            const name = profile.displayName || 'No name available'
            // const token = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '1h' }) // generating token
            return done(null, { email, name })
        } catch (error) {
            return done(error)
        }
    }
));

const app = express()

app.use(passport.initialize())
app.use(cookieParser())

initLog()

app.use('/', appRouter)
app.use('/auth', authRouter)

app.listen(3000, (err) => {
    if (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`
        console.error(errMessage);
        appendFileSync('./logs/index.log', `${errMessage}\n`);
    } else {
        console.info(`[INFO]: Server is running on http://localhost:3000`);
    }
})
