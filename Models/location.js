// location module


const mongoose =require('mongoose');


//create the schema

const schema = mongoose.Schema;

const locationSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },
        city_id : {
            type: Number,
            required: true
        },
        location_id : {
            type: Number,
            required: true
        },
        city : {
            type: String,
            required: true
        },
        country_name : {
            type: String,
            required: true
        }
    }
);


// export the model
module.exports = mongoose.model('Location', locationSchema, 'Location');