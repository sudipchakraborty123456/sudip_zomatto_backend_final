
const user = require("../Models/user");


exports.singUp = (req, res) => {
    const reqBody = req.body;

    //console.log(reqBody);
    //(2)  call a save mathod

    //            a.    we will create an object

    const { email, password, firstName, lastName } = reqBody;
    // console.log(email,password,firstName,lastName);
    const userObj = new user(
        {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
    );

    user.find({
        email: email
    }).then(data => {
        //console.log(`${data}+${data.length}`);
        // console.log("email matched")
        if (data.length > 0) {
            res.json({ "data": "Use another email" })

        } else {
            //console.log("email not matched")
            userObj.save().then(data => {
                res.json({
                    message: "user regesterd successfully",
                    user: data
                })
            }).catch(err => {
                res.json({ error: err });
            });
        }
    }).catch((error) => {
        console.log(error)
    })
    //   b.      call the save method, insert data into MongoDB
};
exports.logIn = (req, res) => {
    const bodyParser = req.body;

    const { email, password } = bodyParser;
    // console.log(email,password);
    user.find({
        email: email
    }).then(data => {
        //console.log(`${data}+${data.length}`);
        // console.log("email matched")
        if (data.length > 0) {
            
            user.find({
                email: email,
                password: password
            }).then(data => {
                if (data.length > 0) {
                    res.json({
                        message: 'User login successfully',
                        user: data
                    });
                }
                else {
                    res.send("UserName or Password is wrong!");
                }

            }).catch(err => {
                res.json({ Error: err });
            })
        
        } else {
            res.json({ "data": "This email is not exist" })
        }
    }).catch((error) => {
        console.log(error)
    })

};