
import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from "./config/connectDB";
import authRoute from "./routes/api.route";

dotenv.config()
  
const app: Application = express();
   
const PORT: Number = 8000;   

connectDB()

const allowedOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}))

app.use(express.json())
app.use(cookieParser())
app.get("/", (req: Request, res: Response) => {
    res.json({message: "test message form the product managment application server"})
})

app.use("/api", authRoute);

app.listen(PORT, () => {  
    console.log(`server start at PORT ${PORT}`)
})