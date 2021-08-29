const config = require('../../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../../utils/mongohelper')


async function transfer(owalletid,walletid,amount){
    let payload = {
        idempotencyKey: uuid.v4(),
        source:{
            "type": "wallet",
            id: walletid,
        },
        destination:{
            "type":"wallet",
            id: owalletid
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
            if(rj.data.balances.length<=0){
                res.status(400).send({message :"Insufficient balance!"});
            }
            let balance = parseFloat(rj.data.balances[0].amount);
            if(balance<amount){
                res.status(400).send({message :"Insufficient balance!"});
            }
            let result = await coll.findOne({ owner });
            let owalletid = null;
            if(!result){
                let r1 = await fetch(`${config.circle_endpoint}/wallets`, {
                    method: 'post',
                    body: JSON.stringify({ idempotencyKey: uuid.v4()}),
                    headers: { 
                        'Authorization': `Bearer ${config.circle_jwt}`,  
                        'Content-Type': 'application/json' 
                    },
                })
                let rj1 = await r1.json();
                if(r1.ok){
                    owalletid = rj1.data.walletId;
                    await coll.insertOne({ owner , walletid:owalletid })

                }else{
                    res.status(400).send(rj1);
                    return;
                }
            }else{
                owalletid = result.walletid;
            }

            try{
                //https://participatehack.herokuapp.com/api/v1/nft/approve?id=sfsdf&amount=34&address=flffsdf
                let ss = await fetch(`https://participatehack.herokuapp.com/api/v1/nft/approve?id=${nft}&amount=${amount}&address=${address}`)
                let sj = await ss.json();
                if(ss.ok && sj.status){
                    try{
                        await transfer(owalletid, walletid, amount)
                        res.send({sucess:true})
                    }catch(e){
                        console.log(e)
                        res.status(400).send({message: e});
                    }
                }else{
                    res.status(400).send({message: "Amount not matching with nft price."});
                }
            }catch(e){
                console.log(e)
                res.status(400).send({message: "Error!"});
                return;
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