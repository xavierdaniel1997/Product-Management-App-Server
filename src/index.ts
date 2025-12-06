import express, {Request, Response} from 'express';

const app = express();

const PORT = 5000;


app.get("/", (req: Request, res: Response) => {
    res.json({message: "test message form the product managment application server"})
})

app.listen(() => {  
    console.log(`server start at PORT ${PORT}`)
})