const config = require('../../config.json')
const fetch = require('node-fetch');
const uuid = require('uuid')
const mongohelper = require('../../utils/mongohelper')

module.exports =async (req,res)=>{
    try{
        let coll = await mongohelper.get_coll("users")
        let address = req.body.auth.address;
        let user =  await coll.findOne({ address });
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
                res.send({sucess: true, balance: 0})
            }
            res.send({sucess: true, balance:rj.data.balances[0].amount})
        }else{
            console.log(rj)
            res.status(400).send(rj);
        }
    }catch(e){
        console.log(e)
        res.status(400).send({message:"Error!"});
    }
}