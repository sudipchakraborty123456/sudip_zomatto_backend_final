const mongoose = require("mongoose");

const schema = mongoose.Schema;

const mealTypeSchema = new schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    meal_type: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model("MealType",mealTypeSchema,"MealType" );