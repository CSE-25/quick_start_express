import express from "express";
import { db } from "./drizzle/db";  
import { sampleTable } from "./drizzle/schema";  
import "dotenv/config";  

const app = express();
const port = process.env.PORT || 3000;  

app.use(express.json());


app.get("/data", async (req, res) => {
    try {
        
        const data = await db.query.sampleTable.findFirst();
        
        if (data) {
            
            res.json(data);
        } else {
            
            res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
