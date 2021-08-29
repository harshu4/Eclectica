const config = require('../../../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../../../utils/mongohelper')



module.exports = async (req,res)=>{
    try{
        let coll = await mongohelper.get_coll("users")
        let auth = req.body.auth;
        let address = auth.address;
        let user =  await coll.findOne({ address });
        let payload={
            idempotencyKey: uuid.v4(),
            currency:"USD",
            chain:"ETH"
        }
       
        let r = await fetch(`${config.circle_endpoint}/wallets/${user.walletid}/addresses`, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: { 
                'Authorization': `Bearer ${config.circle_jwt}`,  
                'Content-Type': 'application/json' 
            },
        })
        let rj = await r.json();
        if(r.ok){
            res.send({sucess:true, address: rj.data.address})
        }else{
            console.log(rj)
            res.status(400).send(rj);
            return;  
        }
    }catch(e){
        console.log(e)
        res.status(400).send({message:"Error!"});
    }
}