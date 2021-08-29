const config = require('../../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../../utils/mongohelper')


async function transfer(walletid, address ,amount){
    let payload = {
        idempotencyKey: uuid.v4(),
        source:{
            "type": "wallet",
            id: walletid,
        },
        destination:{
            address:address,
            "type": "blockchain",
            chain:"ETH"
        },
        amount:{
            amount: amount ,
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
    if(!r1.ok){
        throw(rj1.message)
    }
    console.log(rj1)
}


module.exports =async (req,res)=>{
    try{
        let coll = await mongohelper.get_coll("users")
        let address = req.body.auth.address;
        let user =  await coll.findOne({ address });
        let owner = req.body.owner;
        let nft = req.body.nft;
        let amount = req.body.amount;
        if(owner=="" || nft=="" || amount==""){
            res.status(400).send({message :"Please fill all details!"});
        }
        amount = parseFloat(amount);
        let walletid = user.walletid;
        let r = await fetch(`${config.circle_endpoint}/wallets/${walletid}`, {
            method: 'get',
            headers: { 
                'Authorization': `Bearer ${config.circle_jwt}`
            },
        })
        let rj = await r.json();
        if(r.ok){
            let balance = parseFloat(rj.data.balances[0].amount);
            if(balance<amount){
                res.status(400).send({message :"Insufficient balance!"});
            }
            try{
                await transfer(walletid,address, amount)
                res.send({sucess:true})
            }catch(e){
                console.log(e)
                res.status(400).send({message: e});
            }
        }else{
            console.log(rj)
            res.status(400).send(rj);
        }
    }catch(e){
        console.log(e)
        res.status(400).send({message:"Error!"});
    }
}