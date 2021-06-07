const order = require('../Models/Order');

exports.saveOrder=(req,res)=> {
    const reqBody = req.body;
    const {userName,orderId,userId,restaurantId,orderDetails,totalPrice,orderStatus,userAddress} = reqBody;
    console.log(req.body)
    const placeOrderDetails = new order({
        userId: userId,
        restaurantId: restaurantId,
        orderStatus: orderStatus,
        orderDetails: orderDetails,
        totalPrice: totalPrice,
        userAddress: userAddress,
        userName: userName,
        orderId: orderId
    });

    placeOrderDetails.save().then((data)=>{
        res.json(data);
        
    }).catch((err)=>{
        res.json({error:err})
    } );
};


exports.getOrder=((req,res) => {
    const userId = req.params.userId;
   // console.log(city);
   order.find({ userId : userId}).then( data => {
        res.json({data});
    }).catch( err => {
        res.json({error : err});
    })
})