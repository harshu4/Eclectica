const fetch = require('node-fetch');
const config = require('../config.json')

async function get_public_key(){
    try{
        let r = await fetch(`${config.circle_endpoint}/encryption/public`, {
            method: 'get',
            headers: { 'Authorization': `Bearer ${config.circle_jwt}` },
        })
        r = await r.json();
        return r.data;
    }catch(e){
        console.log(`./utils/circle.js: ${e}`)
    }
}


module.exports ={
    get_public_key
}