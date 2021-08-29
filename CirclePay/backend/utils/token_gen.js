var randomstring = require('./randomstring')

module.exports = ()=>{
    return `${randomstring(4)}-${randomstring(4)}-${randomstring(4)}-${randomstring(4)}`
}