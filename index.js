const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const items = require("./routes/items.js")
const users = require("./routes/users.js")


const app = express()
const port = 3000


app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.use("/items", items)

app.use("/users", users)

app.listen(port, () => {
    console.log("listening on http://localhost:" + port)
})