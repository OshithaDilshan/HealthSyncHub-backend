const express = require('express');
const router = express.Router();

const { GenerateMeal, GetAllMealData } = require('../controllers/mealController');

// Public routes
router.route('/')
  .get(GetAllMealData)
  .post(GenerateMeal);

module.exports = router;
