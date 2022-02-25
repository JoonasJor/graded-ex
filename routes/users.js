const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs")
const passport = require("passport")
const basicStrategy = require("passport-http").BasicStrategy
const users = require('../data/users-data')
const Ajv = require('ajv')
const ajv = new Ajv()
const userSchema = require('../schemas/user.schema.json')

const userInfoValidator = ajv.compile(userSchema)

const userInfoValidateMw = function (req, res, next) {
    const validationResult = userInfoValidator(req.body)
    if(validationResult) {
        next()
    }
    else { 
        res.status(400).json({
            errorDescription: userInfoValidator.errors[0].message,
            errorinfo: userInfoValidator.errors[0].instancePath
        })
    }
}

router.get('/', passport.authenticate("jwt", {session: false}), (req, res) => {
    res.json(users)
})

router.get('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    let foundIndex = users.findIndex(t => t.id == req.params.id);
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    }
    else {
      res.json(users[foundIndex])
    } 
})

router.post('/', userInfoValidateMw, (req, res) => { 
    const salt = bcrypt.genSaltSync(6)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    const userId = uuidv4()
    
    const user = {
        id: userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword      
    }   
    users.push(user)
    
    res.status(201).json({id: userId})
})

passport.use(new basicStrategy(
    function(username, password, done) {
  
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
    // use the token for future authentication
    const payloadData = {
        userId: req.user.id
    }
    const token = jwt.sign(payloadData, secrets.jwtSignKey)

    res.json({token: token})
})

module.exports = router