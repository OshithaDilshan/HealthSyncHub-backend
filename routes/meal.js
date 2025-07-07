const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Ensure this path is correct

const { GenerateMeal, GetAllMealData, GetTodayMealPlan, GetRandomMealPlan, GetMealsByCalorieRange } = require('../controllers/mealController');

router.route('/')
  .get(GetAllMealData) 
  .post(GenerateMeal); 
router.get('/today', protect, GetTodayMealPlan); 
router.get('/random', protect, GetRandomMealPlan); 
router.get('/range', protect, GetMealsByCalorieRange); 


module.exports = router;