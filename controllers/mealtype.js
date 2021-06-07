const mealType = require("../Models/mealtype");


exports.getMealTypes = (req,res) => {
    mealType.find().then( data => {
        res.json({message: "MealType fatched",
                        mealtype : data});
    }).catch(err => {
        res.send(`There is a problem in BackEnd And the error is ${err}`)
    });
};