
// const mealSchema = new mongoose.Schema({
//     day: [{
//         breakfast: [{
//             calories: [{ type: String, required: true }],
//             name: [{ type: String, required: true }]
//         }],
//         lunch: [{
//             calories: [{ type: String, required: true }],
//             name: [{ type: String, required: true }]
//         }],
//         dinner: [{
//             calories: [{ type: String, required: true }],
//             name: [{ type: String, required: true }]
//         }],
//         snack: [{
//             calories: [{ type: String, required: true }],
//             name: [{ type: String, required: true }]
//         }]
//     }]
// });


const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    calorieRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    breakfast: [{
        calories: String,
        name: String
    }],
    lunch: [{
        calories: String,
        name: String
    }],
    dinner: [{
        calories: String,
        name: String
    }],
    snack: [{
        calories: String,
        name: String
    }]
});
const Meal = mongoose.model('MealNew', mealSchema);
module.exports = Meal; // ✅ This is what your router expects