const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getMyProfile, updatePrimaryGoal, updateActivityLevel, updateDietType, updateAllergies, updateDiseases, updateBudget } = require('../controllers/userProfileController');

router.post(
    '/',
    protect,
    [
        check('dateOfBirth', 'Date of birth is required').isISO8601().toDate(),
        check('gender', 'Gender is required').isIn(['male', 'female', 'other', 'prefer-not-to-say']),
        check('height', 'Height must be between 100 and 250 cm')
            .isFloat({ min: 100, max: 250 }),
        check('weight', 'Weight must be between 30 and 300 kg')
            .isFloat({ min: 30, max: 300 }),
        check('healthGoals', 'Health goals must be a string').optional().isString(),
        check('firstName', 'First name must be a string').optional().isString().trim(),
        check('lastName', 'Last name must be a string').optional().isString().trim()
    ],
    createOrUpdateProfile
);


router.get('/me', protect, getMyProfile);


const updatePrimaryGoalMiddleware = [
    protect,
    [
        check('primaryGoal', 'Primary goal is required')
            .isIn(['loss_fat', 'gain_muscle', 'get_toned'])
    ],
    updatePrimaryGoal
];

router.post('/goal', (req, res, next) => {
    if (req.headers['x-http-method-override'] === 'PATCH') {
        return updatePrimaryGoalMiddleware[updatePrimaryGoalMiddleware.length - 1](req, res, next);
    }
    next();
}, ...updatePrimaryGoalMiddleware);

router.patch('/goal', ...updatePrimaryGoalMiddleware);

router.post('/update-goal', 
    protect,
    [
        check('primaryGoal', 'Primary goal is required')
            .isIn(['loss_fat', 'gain_muscle', 'get_toned'])
    ],
    updatePrimaryGoal
);

const updateActivityLevelMiddleware = [
    protect,
    [
        check('activityLevel', 'Activity level is required')
            .isIn(['sedentary', 'lightly-active', 'moderately-active', 'active'])
    ],
    updateActivityLevel
];

router.patch('/activity-level', ...updateActivityLevelMiddleware);
router.post('/activity-level', ...updateActivityLevelMiddleware);

const updateDietTypeMiddleware = [
    protect,
    [
        check('dietType', 'Diet type is required')
            .isIn(['no-restriction', 'pescetarian', 'vegetarian', 'paleo', 'keto', 'vegan'])
    ],
    updateDietType
];

router.patch('/diet-type', ...updateDietTypeMiddleware);
router.post('/diet-type', ...updateDietTypeMiddleware);

const updateAllergiesMiddleware = [
    protect,
    [
        check('allergies', 'Allergies must be an array').isArray(),
        check('allergies.*', 'Each allergy must be a string').isString().trim()
    ],
    updateAllergies
];

router.patch('/allergies', ...updateAllergiesMiddleware);
router.post('/allergies', ...updateAllergiesMiddleware);

const updateDiseasesMiddleware = [
    protect,
    [
        check('diseases', 'Diseases must be an array').isArray(),
        check('diseases.*', 'Each disease must be a string').isString().trim()
    ],
    updateDiseases
];

router.patch('/diseases', ...updateDiseasesMiddleware);
router.post('/diseases', ...updateDiseasesMiddleware);

const updateBudgetMiddleware = [
    protect,
    [
        check('budget', 'Budget is required').isIn(['low', 'high'])
    ],
    updateBudget
];

router.patch('/budget', ...updateBudgetMiddleware);
router.post('/budget', ...updateBudgetMiddleware);

module.exports = router;
