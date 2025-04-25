import Meal from "../insfastructure/schema/meal";
import { Request, Response, NextFunction } from "express";

export const GetAllMealData = async (req: Request, res: Response) => {
    const data = await Meal.find();
    return res.json(data);
}

export const GenerateMeal = async (req: Request, res: Response) => {
    const response = req.body;
    console.log(response);
    await Meal.create(response);
    res.status(201).send();
}