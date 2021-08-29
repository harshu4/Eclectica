const mongohelper = require('../utils/mongohelper')
const sigUtil = require('eth-sig-util')
const config = require('../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')


module.exports= async (req,res,next)=>{
    try{
        let coll = await mongohelper.get_coll("users")
        let auth = req.body.auth;
        let address = auth.address;
        let nonce = auth.nonce;
        let message = auth.message;
        console.log(auth)
        if(!address || !nonce || !message){
            res.status(400).send({
                message: 'Authentication mising.'
            });
            return;
        }

        //need to implement in future
        /*if(Date.now() < nonce || nonce <=0 || Date.now()- nonce >= 600000){
            res.status(400).send({
                message: 'Invalid Nonce.'
            });
            return;
        }*/
      
        if(sigUtil.recoverPersonalSignature({data: `${nonce}`, sig: message}) != address){
            res.status(400).send({
                message: 'Verification failed!'
            });
            return;
        }

        let result = await coll.findOne({ address });
        if(!result){
            let r = await fetch(`${config.circle_endpoint}/wallets`, {
                method: 'post',
                body: JSON.stringify({ idempotencyKey: uuid.v4()}),
                headers: { 
                    'Authorization': `Bearer ${config.circle_jwt}`,  
                    'Content-Type': 'application/json' 
                },
            })
            let rj = await r.json();
            if(r.ok){
                let walletid = rj.data.walletId;
                await coll.insertOne({ address , walletid })
            }else{
                res.status(400).send(rj);
                return;
            }
        }
        next();
    }catch(e){
        console.log(`/middleware/authhelper.js: ${e}`)
        res.status(400).send({
            message: 'Error!'
        }); 
    }
}