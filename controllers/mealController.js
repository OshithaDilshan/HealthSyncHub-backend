const Meal = require("../models/meal");

const GetAllMealData = async (req, res) => {
    try {
        const data = await Meal.find();
        return res.json(data);
    } catch (err) {
        console.error("Error fetching meals:", err);
        res.status(500).send("Server Error");
    }
};

const GenerateMeal = async (req, res) => {
    try {
        const response = req.body;
        console.log(response);
        await Meal.create(response);
        res.status(201).send();
    } catch (err) {
        console.error("Error creating meal:", err);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    GetAllMealData,
    GenerateMeal
};
