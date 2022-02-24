const { v4: uuidv4 } = require('uuid');

const items = [
    {
        "id": uuidv4(),
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
        "id": uuidv4(),
        "title": "toinen komia polkupyörä",
        "category": "Polkupyörät",
        "location": "Myyrmäki",
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
        "id": uuidv4(),
        "title": "nahkarukkaset",
        "category": "Ulkovaatteet",
        "location": "Oulu",
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

module.exports = items