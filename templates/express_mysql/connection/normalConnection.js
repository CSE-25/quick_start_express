import { appConfig } from '../config/appConfig.js'
import { appendFileSync } from 'fs'
import { createConnection } from 'mysql2'

const connectToDb = () => {
    let db = null
    try {
        db = createConnection(appConfig.db)
        return db
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`
        console.error(errMessage);
        appendFileSync('./logs/connection/normalConnection.log', `${errMessage}\n`);
    }
}

export default connectToDb
