var express = require('express')
var router = express.Router()
var register  = require("../controller/user/register")
var authhelper = require('../middleware/authhelper')
var balance = require('../controller/user/balance')
var buy = require('../controller/user/buy')
var withdraw = require('../controller/user/withdraw')

/*router.post('/login', authhelper,(req,res)=>{
    res.send()
})
//router.post('/register', register)*/
router.post('/balance', authhelper, balance)
router.post('/buy', authhelper, buy)
router.post('/withdraw', authhelper, withdraw)


module.exports = router