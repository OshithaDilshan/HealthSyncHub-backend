import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    confirmPassward:
    {
        type: String,
        required: true
    },
    firstName:
    {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    gender:
    {
        type: String,
        required: true
    },
    dob:
    {
        type: String,
        required: true
    },
    height:
    {
        type: String,
        required: true
    },
    weight:
    {
        type: String,
        required: true
    },
    primaryGoal:
    {
        type: String,
        required: true
    },
    activityLevel:
    {
        type: String,
        required: true
    }

});

const User = mongoose.model('User', userSchema);
export default User;