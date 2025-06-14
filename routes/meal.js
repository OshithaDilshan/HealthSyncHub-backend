const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { GenerateMeal, GetAllMealData, GetTodayMealPlan } = require('../controllers/mealController');

// Public routes
router.route('/')
  .get(GetAllMealData)
  .post(GenerateMeal);

router.get('/today', protect, GetTodayMealPlan);

module.exports = router;
