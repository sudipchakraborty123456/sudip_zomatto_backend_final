


const mongoose =require('mongoose');


//create the schema

const schema = mongoose.Schema;

const menuSchema = new mongoose.Schema(
    {
        restaurantId : {
            type: String,
            required: true
        },
        itemPrice : {
            type: Number,
            required: true
        },
        itemName : {
            type: String,
            required: true
        },
        itemDescription : {
            type: String,
            required: true
        },
        isVeg : {
            type: Boolean,
            required: true
        }
    }
);


// export the model
module.exports = mongoose.model('menu', menuSchema, 'Menu');