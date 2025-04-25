import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    day:
        [{
            breakfast:
                [{
                    calories:
                        [{
                            type: String,
                            required: true
                        }],
                    name:
                        [{
                            type: String,
                            required: true
                        }]
                }],
            lunch:
                [{
                    calories:
                        [{
                            type: String,
                            required: true
                        }],
                    name:
                        [{
                            type: String,
                            required: true
                        }]
                }],
            dinner:
                [{
                    calories:
                        [{
                            type: String,
                            required: true
                        }],
                    name:
                        [{
                            type: String,
                            required: true
                        }]
                }],
            snack:
                [{
                    calories:
                        [{
                            type: String,
                            required: true
                        }],
                    name:
                        [{
                            type: String,
                            required: true
                        }]
                }]
        }]
});

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;