import express from "express";
import { GenerateMeal, GetAllMealData } from "../controllers/mealController";

const meal = express.Router();

meal.route("/").get(GetAllMealData).post(GenerateMeal)

export default meal;