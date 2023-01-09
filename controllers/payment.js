const order = require('../Models/Order');
const axios = require('axios');
const orderController = require("../controllers/placeOrder");
// Need some libraries from npmjs.com
require('dotenv').config();
const formidable = require('formidable');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
// Need the external paytm library to authenticate the payments
//const PaytmChecksum = require('./PaytmChecksum.js');
//console.log("paymCallBack:"+PaytmChecksum)
// const {LocalStorage} = require('node-localstorage') ;
// var  localStorage = new LocalStorage('./scratch');
// import('./store.js');
// localStorage.setItem('name','sudip');
// var a = localStorage.getItem('name');
// console.log(a)
var crypto = require('crypto');

class PaytmChecksum {

	static encrypt(input, key) {
		var cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv);
		var encrypted = cipher.update(input, 'binary', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	}
	static decrypt(encrypted, key) {
		var decipher = crypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv);
		var decrypted = decipher.update(encrypted, 'base64', 'binary');
		try {
			decrypted += decipher.final('binary');
		}
		catch (e) {
			console.log(e);
		}
		return decrypted;
	}
	static generateSignature(params, key) {
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.generateSignatureByString(params, key);
	}
	

	static verifySignature(params, key, checksum) {
		if (typeof params !== "object" && typeof params !== "string") {
		   	var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if(params.hasOwnProperty("CHECKSUMHASH")){
			delete params.CHECKSUMHASH
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.verifySignatureByString(params, key, checksum);
	}

	static async generateSignatureByString(params, key) {
		var salt = await PaytmChecksum.generateRandomString(4);
		return PaytmChecksum.calculateChecksum(params, key, salt);
	}

	static verifySignatureByString(params, key, checksum) {		
		var paytm_hash = PaytmChecksum.decrypt(checksum, key);
		var salt = paytm_hash.substr(paytm_hash.length - 4);
		return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
	}

	static generateRandomString(length) {
		return new Promise(function (resolve, reject) {
			crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
				if (!err) {
					var salt = buf.toString("base64");
					resolve(salt);					
				}
				else {
					console.log("error occurred in generateRandomString: " + err);
					reject(err);
				}
			});
		});
	}

	static getStringByParams(params) {
		var data = {};
		Object.keys(params).sort().forEach(function(key,value) {
			data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
		});
		return Object.values(data).join('|');
	}

	static calculateHash(params, salt) {		
		var finalString = params + "|" + salt;
		return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
	}
	static calculateChecksum(params, key, salt) {		
		var hashString = PaytmChecksum.calculateHash(params, salt);
		return PaytmChecksum.encrypt(hashString,key);
	}
}
PaytmChecksum.iv = '@@@@&&&&####$$$$';




exports.payment = (req, res) => {
   
    const { 
        amount,
        email,
        mobileNo,
        orderDetails
    } = req.body;
   // console.log(req.body.orderDetails.orderId);


    



    //will use the Paytm API Keys(.env) and the PaytmChecksum.js to prepare the payment request object

    let params = {};

    params['MID'] = process.env.PAYTM_MID;
    params['WEBSITE'] = process.env.PAYTM_WEBSITE;
    params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
    params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE;
    params['ORDER_ID'] = uuidv4();
    params['CUST_ID'] = email;
    params['TXN_AMOUNT'] = amount.toString();
    params['EMAIL'] = email;
    params['MOBILE_NO'] = mobileNo.toString();
    params['CALLBACK_URL'] = 'https://sudipzomatobackend.onrender.com/paymentCallback';




    req.body.orderDetails.orderId = (params['ORDER_ID']);
     axios({
            method: "POST",
            url: `https://sudipzomatobackend.onrender.com/placeOrder`,
            //headers : {"Content-Type" : "applicaton/json"},
            data: orderDetails
        }).then((data)=>{
            console.log(data);
        }).catch((error)=>{console.log(error);});
    // use PaytmChecksum.js to generate a signature

    let paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);

    paytmCheckSum.then(response => {
        let paytmCheckSumResponse = {
            ...params,
            "CHECKSUMHASH": response
        };
        res.json(paytmCheckSumResponse);
    }).catch(error => {
        res.status(500).json({
            message: "Error in Payment",
            error: error
        });
    });


}

exports.paymentCallback = (req, res) => {
       const form = new formidable.IncomingForm();
       form.parse(req,(error, fields, files) => {
           if(error){
               console.log(error);
               res.status(500).json({error});
           }
           const checkSumhash = fields.CHECKSUMHASH;
           delete fields.CHECKSUMHASH;


           const  isVerified = PaytmChecksum.verifySignature(
               fields,
               process.env.PAYTM_MERCHANT_KEY,
               checkSumhash
           );
           if(isVerified){

            var params={};
            params['MID'] = fields.MID;
            params['ORDER_ID'] = fields.ORDERID;

            PaytmChecksum.generateSignature(
                params,
                process.env.PAYTM_MERCHANT_KEY
            ).then(checksum => {
                params['CHECKSUMHASH'] = checksum;
                const data = JSON.stringify(params);

                const options = {
                    hostname:"securegw-stage.paytm.in",
                    port:443,
                    path:"/order/status",
                    method:"POST",
                    header:{
                        'Content-Type' : 'application/json',
                        'Content-Length' : data.length
                    },
                    data:data
                };
                var  response = "";
                let request = https.request(options,(responseFromPaytmServer) => {
                    responseFromPaytmServer.on('data',(chunk) => {
                        response += chunk;
                    })
                    responseFromPaytmServer.on('end',() => {
                        if(JSON.parse(response).STATUS == 'TXN_SUCCESS'){
                            // let t =  {"paymentStatus":"success"};
                            // t = JSON.stringify(t);
                           //res.sendFile(ejs.renderFile(__dirname  +'/success.html',{t}));
                            console.log(params['ORDER_ID'])
                            order.updateOne({orderId: params['ORDER_ID'] },{$set :{orderStatus:'placed'}}).then((result) => {
                                console.log(result);
                            }).catch((err)=>{
                                console.log(err);
                            })
                        //db.Orders.update({orderId: params['ORDER_ID']},{$set:{orderStatus:'placed'}});
                          res.sendFile(__dirname+'/success.html')
                            
                        //    {
                            
                           
                        //     localStorage.setItem('name','sudip');
                        //     var a = localStorage.getItem('name');
                        //     console.log(a)
                        //    }
                        }else{
                            res.sendFile(__dirname+'/failure.html')
                            //res.sendFile(ejs.renderFile(__dirname  +'/failure.html',{"paymentStatus":"Failure"}));
                        }
                    });
                });
                request.write(data);
                request.end();
            }).catch(err => {
                res.status(500).json({message : "error n transaction",
            error: err});
            } );
           }else{
               cosole.log('Checksum mismatch');
               re.status(500).json({error : "it's a hacker !"})
           }
       })
}


