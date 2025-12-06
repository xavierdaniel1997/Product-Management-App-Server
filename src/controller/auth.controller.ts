import { Request, Response } from "express";


const registerUser = (req: Request, res: Response) => {
    try{
        res.status(200).json({message: "user register successfully"})
    }catch(error: any){
        res.status(400).json({message: "Failed to register the user"})
    }
}

export {registerUser}