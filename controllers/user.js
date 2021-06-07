
const user = require("../Models/user");


exports.singUp =(req,res) => {
    const reqBody = req.body;

//console.log(reqBody);
//(2)  call a save mathod

//            a.    we will create an object

    const {email, password, firstName, lastName} = reqBody;
   // console.log(email,password,firstName,lastName);
    const userObj = new user(
        {
            email : email,
            password : password,
            firstName : firstName,
            lastName : lastName
        }
    );


    //   b.      call the save method, insert data into MongoDB

        userObj.save().then(data => {
            res.json({
                message : "user regesterd successfully",
                user  : data
            })
        }).catch(err => {
            res.json({error :err});
        });

};
exports.logIn =(req,res) => {
    const bodyParser = req.body;

    const { email, password} = bodyParser;
   // console.log(email,password);
    user.find({
        email : email,
        password : password
    }).then( data => {
        if(data.length>0){
        res.json({message : 'User login successfully',
        user : data});
        }
        else{
            res.send("UserName or Password is wrong!");
        }
        
    }).catch(err => { 
        res.json({ Error :err});
    })
};