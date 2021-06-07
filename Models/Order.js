const mongoose = require ("mongoose");

const schema = mongoose.Schema;

const orderSchema = new schema({
    _Id:{
        type : String,
        required : false,
    },
    userId : {
        type : String,
        required : true
    },
    restaurantId:{
        type : String,
        required : true
    },
    orderDetails:  {
        type : Array,
        required : true
    },
    totalPrice:  {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        required : false
    },
    userAddress:   {
        type : String,
        required : true
    },
    __v:  {
        type : Number,
        required : false
    },
    userName:{
        type: String,
        required : true
    },
    orderId:{type:String,
         required:true}
    });


module.exports = mongoose.model("Orders",orderSchema,"Orders");