const { v4: uuidv4 } = require('uuid');

const users = [
    {
        "id": uuidv4(),
        "firstName": "Paavo",
        "lastName": "Pesusieni",
        "email": "paavo@gmail.com",
        "phoneNumber": "0441234567",
        "password": "$2a$06$AtlZgnrgqxk8Y5lpt5Lbiu5siQZXZ.XGn6.445JhHpWWatAj4aZG2" // paavosieni68
    },
    {
        "id": uuidv4(),
        "firstName": "Teppo",
        "lastName": "Tapani",
        "email": "tapani@gmail.com",
        "phoneNumber": "0447654321",
        "password": "$2a$06$cW8iY.JT3e/XJrF/FTzQLe.JVHXaOi7j6zGeeEqyMe5XAXtjJf00W" // tapanisieni46
    }
]

module.exports = users