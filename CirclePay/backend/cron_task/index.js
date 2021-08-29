const config = require('../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../utils/mongohelper')

async function start(){
    let payment_coll = await mongohelper.get_coll("payments")
    let coll = await mongohelper.get_coll("users")

    setInterval(async ()=>{
        try{
            fetch('https://circlepayob.herokuapp.com/')
        }catch(e){

        }
        try{
            let unsettled_payments = await payment_coll.find({ settled: false }).toArray();
            for(let p of unsettled_payments){
                try{
                    let payment_id =  p.paymentid;
                    let r = await fetch(`${config.circle_endpoint}/payments/${payment_id}`, {
                        method: 'get',
                        headers: { 
                            'Authorization': `Bearer ${config.circle_jwt}`                    
                        },
                    })
                    let rj = await r.json();
                    if(r.ok){
                        if(rj.data.status=="paid"){
                            let user = await coll.findOne({ address: p.address });
                            let walletid = user.walletid;
                            let payload = {
                                idempotencyKey: uuid.v4(),
                                source:{
                                    "type": "wallet",
                                    id: rj.data.merchantWalletId,
                                },
                                destination:{
                                    "type":"wallet",
                                    id: walletid
                                },
                                amount:{
                                    amount: String(parseFloat(rj.data.amount.amount)-parseFloat(rj.data.fees.amount)) ,
                                    currency:"USD"
                                }
                            }
                            let r1 = await fetch(`${config.circle_endpoint}/transfers`, {
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: { 
                                    'Authorization': `Bearer ${config.circle_jwt}`,  
                                    'Content-Type': 'application/json' 
                                },
                            })
                            let rj1 = await r1.json();
                            console.log(rj1)
                            await payment_coll.updateOne({paymentid: payment_id},{ $set: { settled: true } })
                        }
                    }else{
                        console.log(rj)
                    }
                }catch(e){
                    console.log(`./cront_task/index.js : ${e}`)
                }
            }
        }catch(e){
            console.log(`./cront_task/index.js : ${e}`)
        }
    },60000)
}

module.exports = start;