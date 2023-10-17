const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = 3002

app.use(morgan('tiny'))
app.use(cors())

app.use(express.json())
app.use('/', require('./routes/router'))
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: 'Everything ok'
    })
})

app.listen(3002, () => {
    console.log(`Server actually running on port http://localhost:${PORT}`)
})