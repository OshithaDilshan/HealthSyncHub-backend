import { Request, Response, NextFunction } from "express"
import User from "../insfastructure/schema/health.ts";
import userData from "../insfastructure/dataSet";
import { send } from "process";


export const GetAllData = async (req: Request, res: Response) => {
    const data1 = userData;
    const data = await User.find();
    return res.json(data1);
}

export const CreateData = async (req: Request, res: Response) => {
    const response = req.body;
    await User.create(response);
    res.status(201).send();
}

export const getDataById = async (req: Request, res: Response) => {
    const userData = await User.findById(req.params._id);
    return res.json(userData);
}

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDataUpdate = User.findById(req.params._id);

        if (!userDataUpdate) {
            return res.status(404).send();
        }
        if (typeof req.body.weight === "undefined" || typeof req.body.height === "undefined" || typeof req.body.physicalInjuries === "undefined" || typeof req.body.allergies === "undefined" || typeof req.body.medicalConditions === "undefined") {
            return res.status(400).send();
        }

        await User.findByIdAndUpdate(req.params._id, {
            weight: req.body.weight,
            height: req.body.height,
            physicalInjuries: req.body.physicalInjuries,
            allergies: req.body.allergies,
            medicalConditions: req.body.medicalConditions
        })
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
} 