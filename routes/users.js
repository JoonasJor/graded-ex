const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs")
const passport = require("passport")
const basicStrategy = require("passport-http").BasicStrategy
const users = require('../data/users')


router.get('/', passport.authenticate("jwt", {session: false}), (req, res) => {
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
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword      
    } 
    users.push(user)

    res.sendStatus(201)
})

passport.use(new basicStrategy(
    function(username, password, done) {
  
        console.log(username + " " + password)
        let user = users.find(user => (user.email == username) && (bcrypt.compareSync(password, user.password)))
        if(user != undefined){
            done(null, user)
        }
        else{
            done(null, false)
        }
    }
))

const jwt = require('jsonwebtoken')
const secrets = require('../secrets.json')

router.post('/login', passport.authenticate("basic", {session: false}), (req, res) => {
    // generate and return JWT upon succesful login
    // we use the token for future authentication
    const payloadData = {
        foo: "bar",
        hops: "pops",
        userId: req.user.id
    }
    const token = jwt.sign(payloadData, secrets.jwtSignKey)

    res.json({token: token})
})

module.exports = router