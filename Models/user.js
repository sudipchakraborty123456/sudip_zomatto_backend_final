const mongoose = require ("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    __v : {
        type : Number,
        required : false
    }
});


module.exports = mongoose.model("User",userSchema,"User");