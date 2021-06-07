const location = require("../Models/location");
exports.getLocation = (req, res) => {

    location.find().then(result => {
        res.status(200).json({message: "locations fatched",
                                location: result});
    }).catch(err => {
        res.status(5000).json({message : "Error in dataBases",
    error : err});
    });

};