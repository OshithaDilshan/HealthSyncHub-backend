const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { trackLoginDate, getLoggedDates } = require('../controllers/loginHistoryController');

const router = express.Router();

// Route to fetch all logged dates for the user
router.get('/logged-dates', protect, getLoggedDates);

// Middleware to track login date after successful login
router.post('/login', protect, trackLoginDate);

module.exports = router;
