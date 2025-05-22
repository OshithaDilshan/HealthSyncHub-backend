const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        required: true
    },
    height: {
        type: Number,
        required: true,
        min: 100,
        max: 250
    },
    weight: {
        type: Number,
        required: true,
        min: 30,
        max: 300
    },
    healthGoals: {
        type: String,
        trim: true
    },
    primaryGoal: {
        type: String,
        trim: true
    },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'lightly-active', 'moderately-active', 'active', ''],
        default: ''
    },
    dietType: {
        type: String,
        enum: ['no-restriction', 'pescetarian', 'vegetarian', 'paleo', 'keto', 'vegan', ''],
        default: ''
    },
    bmi: {
        type: Number,
        default: function() {
            const heightInMeters = this.height / 100;
            return parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
        }
    },
    allergies: {
        type: [String],
        default: []
    },
    diseases: {
        type: [String],
        default: []
    },
    budget: {
        type: String,
        enum: ['low', 'high', ''],
        default: ''
    }
}, {
    timestamps: true
});

userProfileSchema.index({ user: 1 }, { unique: true });

userProfileSchema.pre('save', function(next) {
    if (this.isModified('height') || this.isModified('weight')) {
        const heightInMeters = this.height / 100;
        this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    next();
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
