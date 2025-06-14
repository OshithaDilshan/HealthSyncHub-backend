const Meal = require("../models/meal");
const User = require("../models/User"); // Assuming you have this

// --- Helper Function ---
function getDailyIndex(userId, itemsLength) {
    const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const seedStr = userId + dateStr;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % itemsLength;
}

// --- Basic Calorie Calculator ---
const calculateCaloriesFromUserData = (user) => {
    const { gender, weight, height, dateOfBirth, activityLevel } = user;

    // Calculate age from date of birth
    const age = calculateAge(dateOfBirth);

    if (!age) {
        throw new Error("Age is missing or invalid.");
    }

    let bmr = gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    let activityFactor = 1.2;
    if (activityLevel === 'light') activityFactor = 1.375;
    else if (activityLevel === 'moderate') activityFactor = 1.55;
    else if (activityLevel === 'active') activityFactor = 1.725;

    return Math.round(bmr * activityFactor);
};

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}




const GetTodayMealPlan = async (req, res) => {
    try {
        const user = req.user;

        // Log user data to verify that it contains the required fields
        console.log("User Data in Meal Plan Controller:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure user has the required fields for calorie calculation
        if (!user.gender || !user.weight || !user.height || !user.dateOfBirth || !user.activityLevel) {
            return res.status(400).json({ message: "Missing user data for calorie calculation" });
        }

        const dailyCalories = calculateCaloriesFromUserData(user);

        // Find meals based on the daily calorie range
        const meals = await Meal.find({
            "calorieRange.min": { $lte: dailyCalories },
            "calorieRange.max": { $gte: dailyCalories }
        });

        if (!meals.length) {
            return res.status(404).json({
                message: "No suitable meals found for your calorie range",
                dailyCalories
            });
        }

        const index = getDailyIndex(user._id.toString(), meals.length);
        const todaysMealPlan = meals[index];

        res.json({ dailyCalories, mealPlan: todaysMealPlan });
    } catch (error) {
        console.error("Error in GetTodayMealPlan:", error);
        res.status(500).json({ message: "Server error" });
    }
};








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
    GenerateMeal,
    GetTodayMealPlan
};
