var MongoClient = require('mongodb').MongoClient;
var url = require("../config.json").mongo_url;

let db = null;

async function get_db(){
  if(!db){
    db = await MongoClient.connect(url)
  }
  return db.db("paymentdb");
}

async function get_coll(collname){
  let local_db = await get_db();
  return local_db.collection(collname);
}

module.exports = {get_db,get_coll};

