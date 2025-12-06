
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';

import connectDB from "./config/connectDB";
import authRoute from "./routes/api.route";

dotenv.config()
  
const app = express();
   
const PORT = 5000;   

connectDB()

app.get("/", (req: Request, res: Response) => {
    res.json({message: "test message form the product managment application server"})
})

app.use("/api", authRoute);

app.listen(() => {  
    console.log(`server start at PORT ${PORT}`)
})