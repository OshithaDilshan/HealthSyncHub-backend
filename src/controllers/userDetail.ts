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

export const getUserDataById = async (req: Request, res: Response) => {
    const userData = await User.findById(req.params._id);
    return res.json(userData);
}

export const DeleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params._id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// export const updateData = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userDataUpdate = User.findById(req.params._id);

//         if (!userDataUpdate) {
//             return res.status(404).send();
//         }
//         if (typeof req.body.weight === "undefined" || typeof req.body.height === "undefined" || typeof req.body.physicalInjuries === "undefined" || typeof req.body.allergies === "undefined" || typeof req.body.medicalConditions === "undefined" || typeof req.body.image === "undefined") {
//             return res.status(400).send();
//         }

//         await User.findByIdAndUpdate(req.params._id, {
//             weight: req.body.weight,
//             height: req.body.height,
//             physicalInjuries: req.body.physicalInjuries,
//             allergies: req.body.allergies,
//             medicalConditions: req.body.medicalConditions,
//             image: req.body.image
//         })
//         return res.status(204).send();
//     } catch (error) {
//         next(error)
//     }
// } 
