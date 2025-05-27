const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-email-password'
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d', 
    });
};

exports.register = async (req, res, next) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const profile = await UserProfile.findOne({ user: req.user.id });
        
        if (user && profile) {
            res.json({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                gender: profile.gender,
                height: profile.height,
                weight: profile.weight,
                // healthGoals: profile.healthGoals,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account with that email exists.'
            });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; 
        
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset Token',
                text: message
            });

            res.status(200).json({
                success: true,
                message: 'Email sent with password reset instructions'
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token or token has expired'
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUserProfile = async (req, res, next) => {
    try {
        const { 
            firstName, 
            lastName, 
            dateOfBirth, 
            gender, 
            height, 
            weight, 
            // healthGoals 
        } = req.body;

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = await UserProfile.findOne({ user: req.user.id });

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) {
            user.gender = gender;
            userProfile.gender = gender;
        }
        if (height) {
            user.height = height;
            userProfile.height = height;
        }
        if (weight) {
            user.weight = weight;
            userProfile.weight = weight;
        }
        // if (healthGoals !== undefined) {
        //     user.healthGoals = healthGoals;
        //     userProfile.healthGoals = healthGoals;
        // }

        await user.save();
        await userProfile.save();

        const userResponse = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.weight,
            // healthGoals: userProfile.healthGoals,
            role: user.role
        };

        res.status(200).json(userResponse);
    } catch (error) {
        next(error);
    }
};
