var express = require('express')
var circle = require('../utils/circle')
var card_payment = require('../controller/circlepay/card/payment')
var crypto_payment = require('../controller/circlepay/crypto/payment')
var authhelper = require('../middleware/authhelper')

var router = express.Router()

router.get('/pub', async function (req, res) {
  let r =  await circle.get_public_key();
  if(r){
    res.send({
      sucess: true,
      ...r
    })
  }else{
    res.status(400).send({
      message: 'Not able to get public key.'
  });
  }
})

router.post('/card/payment',authhelper, card_payment )
router.post('/crypto/payment',authhelper, crypto_payment )

module.exports = router