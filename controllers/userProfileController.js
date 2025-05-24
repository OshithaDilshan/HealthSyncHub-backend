const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createOrUpdateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: errors.array() 
            });
        }

        const { 
            dateOfBirth, 
            gender, 
            height, 
            weight, 
            healthGoals,
            primaryGoal,
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const profileFields = {
            user: req.user.id,
            dateOfBirth: new Date(dateOfBirth),
            gender,
            height: parseFloat(height),
            weight: parseFloat(weight),
            healthGoals: healthGoals || '',
            primaryGoal: primaryGoal || ''
        };

        let profile = await UserProfile.findOne({ user: req.user.id });

        if (profile) {
            profile = await UserProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, runValidators: true }
            );
        } else {
            profile = new UserProfile(profileFields);
            await profile.save();
        }
        await User.findByIdAndUpdate(req.user.id, { 
            $set: { profileCompleted: true } 
        });

        res.status(200).json({
            success: true,
            message: 'Profile saved successfully',
            data: profile
        });

    } catch (error) {
        console.error('Error saving profile:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        // Find the user profile
        const profile = await UserProfile.findOne({ user: req.user.id });

        // Find the user data
        const userData = await User.findById(req.user.id).select('-password');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }

        if (!profile) {
            // Return just the user data if no profile exists
            return res.status(200).json({
                success: true,
                message: 'Profile not found, but user exists',
                data: {
                    user: userData
                }
            });
        }

        // Combine user and profile data
        const combinedData = {
            user: userData,
            profile: profile
        };

        res.status(200).json({
            success: true,
            data: combinedData
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get user by ID and profile
exports.getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user profile
        const profile = await UserProfile.findOne({ user: userId });
        
        // Find the user data
        const userData = await User.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }

        if (!profile) {
            // Return just the user data if no profile exists
            return res.status(200).json({
                success: true,
                message: 'Profile not found, but user exists',
                data: {
                    user: userData
                }
            });
        }

        // Combine user and profile data
        const combinedData = {
            user: userData,
            profile: profile
        };

        res.status(200).json({
            success: true,
            data: combinedData
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updatePrimaryGoal = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { primaryGoal } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                primaryGoal
            });
        } else {
            profile.primaryGoal = primaryGoal;
        }
        
        await profile.save({ 
            validateBeforeSave: false,
            session 
        });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating primary goal:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateActivityLevel = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { activityLevel } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                activityLevel
            });
        } else {
            profile.activityLevel = activityLevel;
        }
        
        await profile.save({ 
            validateBeforeSave: false,
            session 
        });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating activity level:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateDietType = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { dietType } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                dietType
            });
        } else {
            profile.dietType = dietType;
        }
        
        await profile.save({ 
            validateBeforeSave: false,
            session 
        });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating diet type:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateAllergies = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { allergies } = req.body;

        if (!Array.isArray(allergies)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Allergies must be an array'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                allergies: allergies
            });
        } else {
            profile.allergies = allergies;
        }
        
        await profile.save({ session });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating allergies:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateDiseases = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { diseases } = req.body;

        if (!Array.isArray(diseases)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Diseases must be an array'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                diseases: diseases
            });
        } else {
            profile.diseases = diseases;
        }
        
        await profile.save({ session });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating diseases:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateBudget = async (req, res, next) => {
    const session = await UserProfile.startSession();
    session.startTransaction();
    
    try {
        const { budget } = req.body;

        if (!['low', 'high'].includes(budget)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Invalid budget value. Must be either "low" or "high"'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        let profile = await UserProfile.findOne({ user: req.user.id });
        
        if (!profile) {
            profile = new UserProfile({
                user: req.user.id,
                budget: budget
            });
        } else {
            profile.budget = budget;
        }
        
        await profile.save({ session });
        
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating budget:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
