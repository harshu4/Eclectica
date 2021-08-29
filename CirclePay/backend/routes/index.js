var express = require('express')
var router = express.Router()
var user = require('./user')
var circle = require('./circle')

router.use('/user', user)
router.use('/circle', circle)


module.exports = router;