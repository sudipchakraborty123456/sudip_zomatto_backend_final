
const menu = require("../Models/menu");


exports.getMenuForRestaurant = (req, res) => {
    const id= req.params.restaurantId;
    //console.log(id);
    menu.find({"restaurantId" : id}).then( data => {
        res.json({menu : data});
    }).catch(err => {
        res.json({Error : err});
    })

}