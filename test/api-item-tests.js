const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)
const { assert } = require('chai')

const serverAddress = "https://bci-graded-exc.herokuapp.com"
const itemInfoArraySchema = require('../schemas/itemArray.schema.json')
const itemInfoSchema = require('../schemas/item.schema.json')


describe('Item tests', function () {
    var token = ""
    var itemId = ""

    /*before(function() {
        server.start()
        console.log(token)
    })

    after(function () {
        server.close()
    })*/

    describe('Get all items - GET /items', function() {
        it("should return all item data", function(done) {
        // send http request
        chai.request(serverAddress)
            .get('/items')
            .end(function (err, res) {
                expect(err).to.be.null 
                // check response status
                expect(res.statusCode).to.equal(200)
            
                // check response data structure
                expect(res.body).to.be.jsonSchema(itemInfoArraySchema)
            
                itemId = res.body[0].id
                done()
            })
        })
    })

    describe('Get single item - GET /item/:id', function() {
        it("should return item data", function(done) {
        // send http request
        chai.request(serverAddress)
            .get("/items/" + itemId)
            .end(function (err, res) {
                expect(err).to.be.null 
                // check response status
                expect(res.statusCode).to.equal(200)

                // check response data structure
                expect(res.body).to.be.jsonSchema(itemInfoSchema)

                done()
            })
        })
    })

    describe('Login - POST /users/login', function() {
        it("should return json web token", function(done) {
        chai.request(serverAddress)
            .post('/users/login')
            .auth('tapani@gmail.com', 'tapanisieni46')
            .end(function (err, res) {
                expect(err).to.be.null 
                expect(res.statusCode).to.equal(200)

                token = res.body.token
                console.log(token) 
                done()
            })
        })
    })
    
    describe("Add new item - POST /items", function() {
        it("should accept item data when data and token is correct", function(done){
        chai.request(serverAddress)
            .post("/items")
            .set("Authorization", "Bearer " + token)
            .send({
                "title": "nahkahanskat",
                "category": "Ulkovaatteet",
                "location": "Tuonela",
                "images": [
                    "D2B766BAD180.jpg",
                    "IMG_2398.png"
                ],
                "price": "2322",
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(201)

                itemId = res.body.id
                done()
            })
        })
        it("should reject request with missing field from data structure", function(done){
        chai.request(serverAddress)
            .post("/items")
            .set("Authorization", "Bearer " + token)
            .send({
                "title": "nahkahanskat",
                "category": "Ulkovaatteet",
                "location": "Tuonela",
                "images": [
                "D2B766BAD180.jpg",
                "IMG_2398.png"
                ],
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })

        })
        it("should reject request with incorrect data types", function(done){
        chai.request(serverAddress)
            .post("/items")
            .set("Authorization", "Bearer " + token)
            .send({
                "title": 123,
                "category": "Ulkovaatteet",
                "location": null,
                "images": [
                "D2B766BAD180.jpg",
                "IMG_2398.png"
                ],
                "price": "2322",
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })

        })
        it("should reject empty post requests", function(done){
        chai.request(serverAddress)
            .post("/items")
            .set("Authorization", "Bearer " + token)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        it("should contain added item data", function(done){
        chai.request(serverAddress)
        .get('/items')
        .end(function (err, res) {
            expect(err).to.be.null 
            expect(res.statusCode).to.equal(200)
            
            // check response data structure
            var found = false
            for(let i=0; i<res.body.length; i++){
                if(res.body[i].id == itemId && 
                    res.body[i].title == "nahkahanskat" &&
                    res.body[i].category == "Ulkovaatteet" &&
                    res.body[i].location == "Tuonela" &&
                    JSON.stringify(res.body[i].images) == JSON.stringify(["D2B766BAD180.jpg", "IMG_2398.png"]) &&
                    res.body[i].price == "2322" &&
                    res.body[i].dateOfPosting == "2022-01-25" &&
                    res.body[i].delivery.shipping == true &&
                    res.body[i].delivery.pickup == false &&
                    res.body[i].seller.firstName == "mansikki" &&
                    res.body[i].seller.lastName == "lehtola" &&
                    res.body[i].seller.email == "mansikki@gmail.com" &&
                    res.body[i].seller.phone == "4343336576767") {
                    found = true
                    break
                    }
                }
            if(!found) {
            assert.fail("Data not saved")
            }
            done()
            })
        })
    })

    describe("Update item data - PUT /items/:id", function() {
        it("should accept updated item data when data and token is correct", function(done){
        chai.request(serverAddress)
            .put("/items/" + itemId)
            .set("Authorization", "Bearer " + token)
            .send({
                "title": "Komiat Nahkarukkaset",
                "category": "Ulkovaatteet",
                "location": "Tuonela",
                "images": [
                    "D2B766BAD180.jpg",
                    "HR66BAD180.jpg",
                    "IMG_2398.png"
                ],
                "price": "1900",
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(200)

                done()
            })
        })
        it("should reject request with missing field from data structure", function(done){
        chai.request(serverAddress)
            .put("/items/" + itemId)
            .set("Authorization", "Bearer " + token)
            .send({
                "title": "Komiat Nahkarukkaset",
                "category": "Ulkovaatteet",
                "location": "Tuonela",
                "images": [
                "D2B766BAD180.jpg",
                "HR66BAD180.jpg",
                "IMG_2398.png"
                ],
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        it("should reject request with incorrect data types", function(done){
        chai.request(serverAddress)
            .put("/items/" + itemId)
            .set("Authorization", "Bearer " + token)
            .send({
                "title": 123,
                "category": "Ulkovaatteet",
                "location": null,
                "images": [
                "D2B766BAD180.jpg",
                "HR66BAD180.jpg",
                "IMG_2398.png"
                ],
                "price": "1900",
                "dateOfPosting": "2022-01-25",
                "delivery": { "shipping": true, "pickup": false },
                "seller": {
                    "firstName": "mansikki",
                    "lastName": "lehtola",
                    "email": "mansikki@gmail.com",
                    "phone": "4343336576767"
                }
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        it("should reject empty put requests", function(done){
        chai.request(serverAddress)
            .put("/items/" + itemId)
            .set("Authorization", "Bearer " + token)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        it("should contain added item data", function(done){
        chai.request(serverAddress)
            .get("/items")
            .end(function (err, res) {
                expect(err).to.be.null 
                expect(res.statusCode).to.equal(200)
                
                // check response data structure
                var found = false
                for(let i=0; i<res.body.length; i++){
                    if(res.body[i].id == itemId && 
                        res.body[i].title == "Komiat Nahkarukkaset" &&
                        res.body[i].category == "Ulkovaatteet" &&
                        res.body[i].location == "Tuonela" &&
                        JSON.stringify(res.body[i].images) == JSON.stringify(["D2B766BAD180.jpg", "HR66BAD180.jpg", "IMG_2398.png"]) &&
                        res.body[i].price == "1900" &&
                        res.body[i].dateOfPosting == "2022-01-25" &&
                        res.body[i].delivery.shipping == true &&
                        res.body[i].delivery.pickup == false &&
                        res.body[i].seller.firstName == "mansikki" &&
                        res.body[i].seller.lastName == "lehtola" &&
                        res.body[i].seller.email == "mansikki@gmail.com" &&
                        res.body[i].seller.phone == "4343336576767") {
                        found = true
                        break
                        }
                    }
                if(!found) {
                assert.fail("Data not saved")
                }
                done()
            })
        })
    })

    describe("Delete item - Delete /items/:id", function() {
        it("should accept request when token is correct", function(done){
        chai.request(serverAddress)
            .delete("/items/" + itemId)
            .set("Authorization", "Bearer " + token)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(202)

                done()
            })
        })
        it("should delete item data", function(done){
        chai.request(serverAddress)
            .get("/items")
            .end(function (err, res) {
                expect(err).to.be.null 
                expect(res.statusCode).to.equal(200)
                
                // check response data structure
                var found = false
                for(let i=0; i<res.body.length; i++){
                    if(res.body[i].id == itemId){
                        found = true
                        break
                    }
                }
                if(found) {
                assert.fail("Data not deleted")
                }
                done()
            })
        })
    })

    describe("Upload image to Cloudinary - POST /items/upload", function() {

        it("should upload image(s) when token is correct", function(done){
        chai.request(serverAddress)
            .post("/items/upload")
            .set("Authorization", "Bearer " + token)
            .attach('image', 'test/test_image.png')
            .attach('image', 'test/test_image2.jpg')
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(200)

                done()
            })
        }).timeout(10000);
        it("should reject empty request", function(done){
        chai.request(serverAddress)
            .post("/items/upload")
            .set("Authorization", "Bearer " + token)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)

                done()
            })
        })
        it("should reject requests with more than 4 images", function(done){
        chai.request(serverAddress)
            .post("/items/upload")
            .set("Authorization", "Bearer " + token)
            .attach('image', 'test/test_image.png')
            .attach('image', 'test/test_image2.jpg')
            .attach('image', 'test/test_image2.jpg')
            .attach('image', 'test/test_image2.jpg')
            .attach('image', 'test/test_image2.jpg')
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
    
                done()
            })
        }).timeout(10000);
        it("should reject requests with something other than image files", function(done){
        chai.request(serverAddress)
            .post("/items/upload")
            .set("Authorization", "Bearer " + token)
            .send({
                "title": 123,
                "category": "Ulkovaatteet"
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
    
                done()
            })
        })
    })
})