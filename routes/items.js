const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const items = require('../data/items-data')
const users = require('../data/users-data')

//const secrets = require('../secrets.json')
const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt
let jwtValidationOptions = {}
jwtValidationOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtValidationOptions.secretOrKey = "supersecretkey123"

const Ajv = require('ajv')
const ajv = new Ajv()
const itemSchema = require('../schemas/item.schema.json')

const itemInfoValidator = ajv.compile(itemSchema)
const itemInfoValidateMw = function (req, res, next) {
    const validationResult = itemInfoValidator(req.body)
    if(validationResult) {
        next()
    }
    else {
        res.status(400).json({
            errorDescription: itemInfoValidator.errors[0].message,
            errorinfo: itemInfoValidator.errors[0].instancePath
        })
    }
}

passport.use(new JwtStrategy(jwtValidationOptions, function(jwt_payload, done) {
  const user = users.find(u => u.id == jwt_payload.userId)
  done(null, user)
}));

router.get('/', (req, res) => {
    // filter items based on query parameters
    // if no parameters return all items
    var result = items.filter(search, req.query)

    function search(item){
      return Object.keys(this).every((key) => item[key] === this[key])
    }
    res.json(result)  
})

router.get('/:id', (req, res) => {
    let foundIndex = items.findIndex(t => t.id == req.params.id)
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    }
    else {
      res.json(items[foundIndex])
    } 
})

router.put('/:id', passport.authenticate("jwt", {session: false}), itemInfoValidateMw, (req, res) => {
    let foundItem = items.find(t => t.id == req.params.id)
    if(foundItem){
        foundItem.title = req.body.title,
        foundItem.category = req.body.category,
        foundItem.location = req.body.location,
        foundItem.images = req.body.images,
        foundItem.price = req.body.price,
        foundItem.dateOfPosting = req.body.dateOfPosting,
        foundItem.delivery = req.body.delivery,
        foundItem.seller = req.body.seller
        res.sendStatus(200)
    }
    else {
        res.sendStatus(404)
    }
})

router.delete('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    let foundIndex = items.findIndex(t => t.id == req.params.id)
  
    if(foundIndex === -1) {
        res.sendStatus(404)
    }
    else {
        items.splice(foundIndex, 1)
        res.sendStatus(202)
    } 
})

router.post('/', passport.authenticate("jwt", {session: false}), itemInfoValidateMw, (req, res) => {
    const itemId = uuidv4()
    items.push({
        id: itemId,
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        images: req.body.images,
        price: req.body.price,
        dateOfPosting: req.body.dateOfPosting,
        delivery: req.body.delivery,
        seller: req.body.seller
    })
    res.status(201).json({id: itemId})
})

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')

/*cloudinary.config({ 
    cloud_name: secrets.cloud_name, 
    api_key: secrets.api_key, 
    api_secret: secrets.api_secret,
})*/

// Config cloudinary storage for multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Uploads',
      format: async (req, file) => 'jpg',
      public_id: (req, file) => uuidv4(),
    },
  });
  
var parser = multer({ storage: storage }).array("image", 4)
  
// POST route for reciving the uploads. multer-parser will handle the incoming data based on the 'image' key
// Once multer has completed the upload to cloudinary, it will come to the handling function
router.post('/upload',function(req,res){
    parser(req,res,function(err) {
        if(req.files){
            
            if(err) {
                res.status(400).send("Error uploading file(s)")
            }
            else{
                console.log(req.files)
                res.sendStatus(200)
            }  
        }
        else{ res.sendStatus(400) }  
    })
})

module.exports = router