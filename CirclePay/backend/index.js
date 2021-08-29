const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const cront_task = require('./cron_task/index')

cront_task()
const app = express()
const port = 3000


app.use(cors())
app.use(bodyParser.json()) 

app.get('/', (req, res) => {
  res.send()
})

app.use('/api',routes)

app.listen(process.env.PORT || port, () => {
  console.log(`listening at http://localhost:${port}`)
})
