import User from "../insfastructure/schema/user";
import { Request, Response, NextFunction } from "express";

export const GetAllUserData = async (req: Request, res: Response) => {
    const data = await User.find();
    return res.json(data);
}
 
export const CreateUser = async (req: Request, res: Response) => {
    const response = req.body;
    console.log(response);
    await User.create(response);
    res.status(201).send();
}
