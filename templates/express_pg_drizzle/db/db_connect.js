import {drizzle} from "drizzle-orm/node-postgres";
import pg from "pg";

const client = new pg.Client({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

client
    .connect()
    .then(()=> {
        console.log("DB Connected Successfully");
    })
    .catch((err)=> {
        console.log(err);
        
    });

const db = drizzle(client);

export default db;
