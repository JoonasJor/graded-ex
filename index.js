const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const items = [
    {
        "id": 0,
        "title": "komia polkupyörä",
        "category": "Polkupyörät",
        "location": "Oulu",
        "images": [
            "https://cdn.discordapp.com/attachments/801484759191519292/926215933847035914/83DC6703-27D5-45DD-9D0F-D2B766BAD180.jpg", 
            "https://cdn.discordapp.com/attachments/801484759191519292/926215696919191622/IMG_2398.jpg"
        ],
        "price": "150",
        "dateOfPosting": "2022-01-20",
        "delivery": { "shipping": false, "pickup": true },
        "seller": {
            "firstName": "teppo",
            "lastName": "tapani",
            "email": "teppo@gmail.com",
            "phone": "434343434343"
        }
    },
    {
        "id": 1,
        "title": "nahkarukkaset",
        "category": "Ulkovaatteet",
        "location": "Myyrmäki",
        "images": [
            "https://cdn.discordapp.com/attachments/801484759191519292/926215933847035914/83DC6703-27D5-45DD-9D0F-D2B766BAD180.jpg",              
            "https://cdn.discordapp.com/attachments/801484759191519292/926215696919191622/IMG_2398.jpg"
        ],
        "price": "222",
        "dateOfPosting": "2022-01-20",
        "delivery": { "shipping": true, "pickup": true },
        "seller": {
            "firstName": "mansikki",
            "lastName": "lehtola",
            "email": "mansikki@gmail.com",
            "phone": "4343336576767"
        }
    }
]

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.get('/items', (req, res) => {
    res.json(items)
})

app.get('/items/:id', (req, res) => {
    let foundIndex = items.findIndex(t => t.id == req.params.id);
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    }
    else {
      res.json(items[foundIndex])
    } 
})

app.put('/items/:id', (req, res) => {
    let foundItem = items.find(t => t.id == req.params.id);
    if(foundItem){
        foundItem.id = items.length,
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
    else{
        res.sendStatus(404)
    }
})

app.delete('/items/:id', (req, res) => {
    let foundIndex = items.findIndex(t => t.id == req.params.id);
  
    if(foundIndex === -1) {
        res.sendStatus(404)
    }
    else {
        items.splice(foundIndex, 1);
        res.sendStatus(202);
    } 
})

app.post('/items', (req, res) => {
    items.push({
      id: items.length,
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

app.listen(port, () => {
    console.log("listening on http://localhost:" + port)
})