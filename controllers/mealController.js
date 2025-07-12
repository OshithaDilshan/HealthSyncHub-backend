
const Meal = require('../models/meal'); 
const User = require("../models/User"); // Assuming you have this
const UserProfile = require("../models/UserProfile");

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


const calculateCaloriesFromUserData = (userProfile) => {
    const { gender, weight, height, dateOfBirth, activityLevel } = userProfile;

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


function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}




const GetTodayMealPlan = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ 
                message: "Authentication required. Please log in to view your meal plan." 
            });
        }

        const userProfile = await UserProfile.findOne({ user: user._id });

        if (!userProfile) {
            return res.status(404).json({
                message: "User profile not found. Please complete your profile to view your meal plan."
            });
        }

       
        const requiredFields = ['gender', 'weight', 'height', 'dateOfBirth', 'activityLevel'];
        const missingFields = requiredFields.filter(field => !userProfile[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Please complete your profile to get a personalized meal plan. Missing: ${missingFields.join(', ')}`,
                missingFields
            });
        }

      
        const dailyCalories = calculateCaloriesFromUserData(userProfile);


      
        const mealPlan = await Meal.findOne({
            "calorieRange.min": { $lte: dailyCalories },
            "calorieRange.max": { $gte: dailyCalories }
        });

        if (!mealPlan) {
            return res.status(404).json({
                message: "No suitable meal plan found for your calorie needs",
                dailyCalories,
                suggestion: "Please contact support to add more meal plan options"
            });
        }

       
        const getRandomItem = (array) => {
            if (!array || array.length === 0) return null;
            return array[Math.floor(Math.random() * array.length)];
        };

      
        res.json({
            dailyCalories,
            mealPlan: {
                breakfast: mealPlan.breakfast ? [getRandomItem(mealPlan.breakfast)] : [],
                lunch: mealPlan.lunch ? [getRandomItem(mealPlan.lunch)] : [],
                dinner: mealPlan.dinner ? [getRandomItem(mealPlan.dinner)] : [],
                snack: mealPlan.snack ? [getRandomItem(mealPlan.snack)] : []
            },
            message: "Daily meal plan generated successfully"
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server error while generating meal plan",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const GetRandomMealPlan = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await UserProfile.findOne({ user: user._id });

        if (!userProfile) {
            return res.status(404).json({
                message: "User profile not found. Please complete your profile to view your meal plan."
            });
        }

      
        const dailyCalories = calculateCaloriesFromUserData(userProfile);

      
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

      
        const randomIndex = Math.floor(Math.random() * meals.length);
        const selectedMealPlan = meals[randomIndex];

      
        const response = {
            dailyCalories,
            mealPlan: {
                breakfast: selectedMealPlan.breakfast || [],
                lunch: selectedMealPlan.lunch || [],
                dinner: selectedMealPlan.dinner || [],
                snack: selectedMealPlan.snack || []
            },
            generated: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            message: "Server error while generating random meal plan",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};







const GetAllMealData = async (req, res) => {
    try {
        const data = await Meal.find();
        return res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching meals" });
    }
};

const GetMealsByCalorieRange = async (req, res) => {
    try {
        const { min, max } = req.query;
        
        if (!min || !max) {
            return res.status(400).json({ message: "Both min and max calorie values are required" });
        }

        const meals = await Meal.find({
            "calorieRange.min": { $lte: parseInt(max) },
            "calorieRange.max": { $gte: parseInt(min) }
        });

        res.json({
            count: meals.length,
            meals
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching meals by calorie range" });
    }
};

const GenerateMeal = async (req, res) => {
    try {
        const mealData = req.body;
        
        // Validate required fields
        if (!mealData.calorieRange || !mealData.calorieRange.min || !mealData.calorieRange.max) {
            return res.status(400).json({ message: "Calorie range is required" });
        }

        const newMeal = await Meal.create(mealData);
        res.status(201).json({ 
            message: "Meal plan created successfully",
            meal: newMeal
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Server error while creating meal",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    GetAllMealData,
    GenerateMeal,
    GetTodayMealPlan,
    GetRandomMealPlan,
    GetMealsByCalorieRange
};