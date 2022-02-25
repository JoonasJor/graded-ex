const express = require('express')
const bodyParser = require('body-parser')
const items = require("./routes/items.js")
const users = require("./routes/users.js")

const app = express()
const port = process.env.PORT || 8080


app.use(bodyParser.json())

app.get("/", function (req, res) {
    res.send("b")
})

app.use("/items", items)

app.use("/users", users)

let serverInstance = null

module.exports = {
    start: function(){
        serverInstance = app.listen(port, () => {
            console.log("listening on https://bci-graded-exc.herokuapp.com/:" + port)
        })
    },
    close: function(){
        serverInstance.close()
    }
}