import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get("/docs", (req, res) => {});

console.log(process.env.MONGO_URI);

app.listen(5174, () => {
    console.log("server started at http://localhost:5174");
});