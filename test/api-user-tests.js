const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)
const { assert } = require('chai')

const serverAddress = "https://bci-graded-exc.herokuapp.com"
const userInfoArraySchema = require('../schemas/userArray.schema.json')
const userInfoSchema = require('../schemas/user.schema.json')

describe('User tests', function () {
    var token = ""
    var userId = ""
  
    /*before(function() {
      server.start()
    })
  
    after(function () {
      server.close()
    })*/

    describe('Login - POST /users/login', function() {
        it("should return json web token", function(done) {
        chai.request(serverAddress)
            .post('/users/login')
            .auth('paavo@gmail.com', 'paavosieni68')
            .end(function (err, res) {
                expect(err).to.be.null 
                expect(res.statusCode).to.equal(200)
              
                token = res.body.token
                console.log(token)
                done()
            })
        })
    })

    describe('Register new user - POST /users', function() {
        it("should accept user data when data is correct", function(done) {
        // send http request
        chai.request(serverAddress)
            .post("/users")
            .auth('tapani@gmail.com', 'tapanisieni46')
            .send({
                "firstName": "Matti",
                "lastName": "Muoniola",
                "email": "matti@gmail.com",
                "phoneNumber": "0447456123",
                "password": "maunulankukkasadot"
            })
            .end(function (err, res) {
                expect(err).to.be.null 
                // check response status
                expect(res.statusCode).to.equal(201)

                userId = res.body.id
                done()
            })
        })
        it("should reject request with missing field from data structure", function(done){
        chai.request(serverAddress)
            .post("/users")
            .set("Authorization", "Bearer " + token)
            .send({
                "lastName": "Muoniola",
                "email": "matti@gmail.com",
                "phoneNumber": "0447456123",
                "password": "maunulankukkasadot"
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })

        })
        it("should reject request with incorrect data types", function(done){
        chai.request(serverAddress)
            .post("/users")
            .set("Authorization", "Bearer " + token)
            .send({
                "firstName": 123,
                "lastName": "Muoniola",
                "email": "matti@gmail.com",
                "phoneNumber": null,
                "password": "maunulankukkasadot"
            })
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })

        })
        it("should reject empty post requests", function(done){
        chai.request(serverAddress)
            .post("/users")
            .set("Authorization", "Bearer " + token)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        it("should contain added user data", function(done){
        chai.request(serverAddress)
        .get('/users')
        .set("Authorization", "Bearer " + token)
        .end(function (err, res) {
            expect(err).to.be.null 
            expect(res.statusCode).to.equal(200)
            
            // check response data structure
            var found = false
            for(let i=0; i<res.body.length; i++){
                if(res.body[i].id == userId && 
                    res.body[i].firstName == "Matti" &&
                    res.body[i].lastName == "Muoniola" &&
                    res.body[i].email == "matti@gmail.com" &&
                    res.body[i].phoneNumber == "0447456123" ){
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

    describe('Get all users - GET /users', function() {
        it("should return all user data", function(done) {       
        chai.request(serverAddress)
            .get('/users')
            .set("Authorization", "Bearer " + token)
            .end(function (err, res) {
                expect(err).to.be.null             
                expect(res.statusCode).to.equal(200)          
                // check response data structure
                expect(res.body).to.be.jsonSchema(userInfoArraySchema)
    
                done()
            })
        })
    })
    
    describe('Get single user - GET /users/:id', function() {
        it("should return single user data", function(done) {
        chai.request(serverAddress)
            .get("/users/" + userId)
            .set("Authorization", "Bearer " + token)
            .end(function (err, res) {
                expect(err).to.be.null 
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.be.jsonSchema(userInfoSchema)
    
                done()
            })
        })
    })
})