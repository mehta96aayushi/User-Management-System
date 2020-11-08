const express = require('express')
var app = express()

const morgan = require('morgan')

/* Show which kind of request are being called (values: short, combined) */
app.use(morgan('short'))

let usersRoute = require('./routes/users')

app.use(usersRoute)

app.use(express.static('public'))

// http://localhost:3003
const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.info(`Server has started on ${PORT}....`))

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from root")
})
