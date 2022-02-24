const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs")


const users = [
    {
        "id": uuidv4(),
        "firstName": "Paavo",
        "lastName": "Pesusieni",
        "email": "sieni@gmail.com",
        "password": "paavosieni68"
    },
    {
        "id": uuidv4(),
        "firstName": "Teppo",
        "lastName": "Tapani",
        "email": "tapani@gmail.com",
        "password": "tapanisieni46"
    }
]

router.get('/', (req, res) => {
    res.json(users)
})

router.get('/:id', (req, res) => {
    let foundIndex = users.findIndex(t => t.id == req.params.id);
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    }
    else {
      res.json(users[foundIndex])
    } 
})

router.post('/', (req, res) => {

    const salt = bcrypt.genSaltSync(6)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
  
    const user = {
      id: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword      
    } 
    users.push(user)

    res.sendStatus(201)
})

module.exports = router