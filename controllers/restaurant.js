const restaurant = require("../Models/restaurant");
exports.getAllRestaurant = (req, res) => {
    restaurant.find().then((data) => {
        res.json({
            "Message": "Restaurant data fatched",
            restaurants: data
        });
    }).catch(err => {
        res.json({ Error: err });
    })

};
exports.getAllRestaurantById = (req, res) => {
    const id = req.params.restaurantId;
    restaurant.find({ "_id": id }).then(data => {
        res.json({ restaurant: data });
    }).catch(err => {
        res.json({ Error: err });
    })
};
exports.getAllRestaurantByCity = (req, res) => {
    const city = req.params.city;
    console.log(city);
    restaurant.find({ city: city }).then(data => {
        res.json({ city: data });
    }).catch(err => {
        res.json({ error: err });
    })
}
exports.filterRestaurant = (req, res) => {
    const { mealtype,
        location,
        cuisine,
        hcost,
        lcost,
        sort = 1,
        page = 1,
        locality } = req.body;
    let filters = {};
    if (mealtype) {
        filters.mealtype_id = mealtype;
    }
    if (location) {
        filters.location_id = location;
    }
    if (cuisine && cuisine.length > 0) {
        filters["cuisine.name"] = {
            $in: cuisine
        };
    }
    if (hcost != undefined && lcost != undefined) {
        if (lcost == 0) {
            filters.min_price = {
                $lt: hcost
            };
        } else {
            filters.min_price = {
                $lt: hcost,
                $gt: lcost
            }
        }
    }
    if (locality) {
        filters.locality = locality;
    }
    const filtersJson = JSON.stringify(filters);
    if (page) {
        var pageNo = 1;
        pageNo = page;
    }
    restaurant.find(filters).sort({ min_price: sort }).then(data => {
        const pageSize = 2;
        let temp;
        function pagein(array, pageSize, pageNo) {
            return array.slice((page - 1) * pageSize, page * pageSize);
        }
        temp = pagein(data, pageSize, page);
        res.json({
            message: "Filter succesfull", "Number of restaurants found :": temp.length,
            restaurant: temp,
            totalResults: data.length,
            pageNo: pageNo,
            pageSize: pageSize
        })
    }).catch(err => {
        res.status(400).json({ message: "Error " + err });
    })
};