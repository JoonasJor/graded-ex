const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const items = require('../data/items')
const users = require('../data/users')

const secrets = require('../secrets.json')
const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt
let jwtValidationOptions = {}
jwtValidationOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtValidationOptions.secretOrKey = secrets.jwtSignKey

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

router.put('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
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

router.post('/', passport.authenticate("jwt", {session: false}), (req, res) => {
    items.push({
      id: uuidv4(),
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      images: req.body.images,
      price: req.body.price,
      dateOfPosting: req.body.dateOfPosting,
      delivery: req.body.delivery,
      seller: req.body.seller
    })

    res.sendStatus(201);
})

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')

cloudinary.config({ 
    cloud_name: secrets.cloud_name, 
    api_key: secrets.api_key, 
    api_secret: secrets.api_secret,
})

// Config cloudinary storage for multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'some-folder-name',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });
  
var parser = multer({ storage: storage })
  
// POST route for reciving the uploads. multer-parser will handle the incoming data based on the 'image' key
// Once multer has completed the upload to cloudinary, it will come to the handling function
// below, which then sends the 201 (CREATED) response. Notice that error handling has not been properly implemented.
router.post('/upload', parser.single('image'), function (req, res) {
    console.log(req.file)
    res.json(req.file)
})

module.exports = router