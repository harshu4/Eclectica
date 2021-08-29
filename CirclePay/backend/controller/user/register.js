const mongohelper = require('../../utils/mongohelper')
const tokengen = require("../../utils/token_gen")
const WAValidator = require('multicoin-address-validator');


async function get_unique_token(){
    let coll = await mongohelper.get_coll("users")
    let token = null;
    let result = "_";
    while(result){
        token = tokengen();
        result = await coll.findOne({ token });
    }
    return token;
}

module.exports = async (req,res)=>{
    try{
        let coll = await mongohelper.get_coll("users")
        let polygon_address = req.body.polygon_address;
        let valid = WAValidator.validate(polygon_address,currency="eth");
        if(!valid){
            res.status(400).send({
                message: 'Bad Polygon Address.'
            });
            return;
        }
        if(polygon_address){
            let isAddressExsist =  await coll.findOne({ polygon_address });
            let token = await get_unique_token();
            if(!isAddressExsist){
                await coll.insertOne({ token, polygon_address })
                res.send({
                    sucess: true,
                    token
                })
            }else{
                res.status(400).send({
                    message: 'Polygon Address Already Registered.'
                });
            }
            
        }else{
            res.status(400).send({
                message: 'All input field required.'
            });
        }
    }catch(e){
        res.status(400).send({
            message: 'This is an error!'
        });
        console.log(`./controller/user/register.js: ${e}`)
    }
}