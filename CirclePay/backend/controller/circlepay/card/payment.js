const crypto = require('crypto');
const token_gen = require('../../../utils/token_gen')
const config = require('../../../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../../../utils/mongohelper')


module.exports =async (req,res)=>{
    try{
        let payment_coll = await mongohelper.get_coll("payments")
        let encryptedData = req.body.encryptedData;
        let address = req.body.auth.address;
        let amountu =  req.body.amountu;
        let name  = req.body.name;
        let keyid  = req.body.keyid;
        let city = req.body.city;
        let country = req.body.country;
        let line1 = req.body.line1;
        let line2 = req.body.line2;
        let postalCode = req.body.postalCode;
        let email = req.body.email;
        let expMonth = req.body.expMonth;
        let expYear = req.body.expYear;
        let ip = req.socket.remoteAddress;
        let hash = crypto.createHash('md5').update(token_gen()).digest('hex');
        let idk = uuid.v4();
        let payload = {
            idempotencyKey: idk,
            encryptedData: encryptedData,
            keyId: keyid,
            billingDetails:{
                name: name,
                city: city,
                country: country,
                line1: line1,
                line2: line2,
                postalCode: postalCode
            },
            expMonth: parseInt(expMonth),
            expYear: parseInt(expYear),
            metadata : {
                email: email,
                sessionId: hash,
                ipAddress: ip
            } 
        }
        console.log(payload)
        let r = await fetch(`${config.circle_endpoint}/cards`, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: { 
                'Authorization': `Bearer ${config.circle_jwt}`,  
                'Content-Type': 'application/json' 
            },
        })
        let rj = await r.json();
        if(r.ok){
            let payload1={
                idempotencyKey: uuid.v4(),
                metadata : {
                    email: email,
                    sessionId: hash,
                    ipAddress: ip
                },
                amount:{
                    amount: amountu,
                    currency: 'USD'
                } ,
                verification:'none',
                source:{
                    id: rj.data.id,
                    type: 'card'
                }
            }
            let r1 = await fetch(`${config.circle_endpoint}/payments`, {
                method: 'post',
                body: JSON.stringify(payload1),
                headers: { 
                    'Authorization': `Bearer ${config.circle_jwt}`,  
                    'Content-Type': 'application/json' 
                },
            })
            let rj1 = await r1.json();
            await payment_coll.insertOne({ address, cardid: rj.data.id, type:"card",  paymentid: rj1.data.id, settled: false })

            if(r1.ok){
                res.send(rj1)
            }else{
                console.log(rj1)
                res.status(400).send({
                    message:   rj1.message
                });
                return;  
            }


        }else{
            console.log(rj)
            res.status(400).send({
                message:   rj.message
            });
            return;         
        }

       

    }catch(e){
        console.log(`./controller/circlepay/card/payment.js: ${e}`)
        res.status(400).send({
            message:   "This is an error!"
        });

    }
}   