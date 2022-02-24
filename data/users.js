const { v4: uuidv4 } = require('uuid');

const users = [
    {
        "id": uuidv4(),
        "firstName": "Paavo",
        "lastName": "Pesusieni",
        "email": "sieni@gmail.com",
        "phoneNumber": "0441234567",
        "password": "paavosieni68"
    },
    {
        "id": uuidv4(),
        "firstName": "Teppo",
        "lastName": "Tapani",
        "email": "tapani@gmail.com",
        "phoneNumber": "0447654321",
        "password": "tapanisieni46"
    }
]

module.exports = users