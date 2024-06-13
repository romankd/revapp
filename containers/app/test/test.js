process.env.NODE_ENV = 'test';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { expect }  from 'chai';
import request from 'request';
const mongoose = require('mongoose');
const UserModel = require('../models/user.cjs');
const dbConfig = require('../configs/database.cjs')
var random_name = require('node-random-name');

const url = 'http://localhost:3000/hello/'

mongoose.connect(dbConfig.url)
    .catch((error) => console.error('MongoDB connection error:', error));

await UserModel.deleteMany({});


describe('Testing GET user method', () => {
    var username = random_name({ first: true });

    it('Request for used that doesn\'t exist', function(done) {
        request.get(url + username, function(error, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });                                   
});


describe('Testing GET and PUT user methods', () => {
    var username = random_name({ first: true });

    it('Adds a new user', function(done) {
        request({          
            url: url + username,      
            method: "PUT",                        
            headers: {                             
            "content-type": "application/json",
            },
            json: true,
            body: {'dateOfBirth': '1997-02-05'}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(204);
                done();
            });
    });                                         
                                                    
    it('Adds existing user', function(done) {
        request({          
            url: url + username,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': '1997-02-05'}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(404);
                done();
            });
    });
    
    it('Request for existing user', function(done) {
        request.get(url + username, function(error, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });    
});

describe('Testing PUT validators.', () => {
    var username2 = random_name({ first: true });

    it('Testing incorrect date format.', function(done) {
        request({          
            url: url + username2,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': '1997-02-55'}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(422);
                done();
            });
    });

    it('Testing incorrect name format.', function(done) {
        request({          
            url: url + username2 + "1",      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': '1997-02-55'}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(422);
                done();
            });
    });

    it('Testing empty field.', function(done) {
        request({          
            url: url + username2,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(422);
                done();
            });
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bday = tomorrow.toISOString().slice(0, 10);

    it('Testing with the date greater that today.', function(done) {
        request({          
            url: url + username2,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': bday}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(422);
                done();
            });
    });
    
});

describe('Testing GET bday days.', () => {
    var username3 = random_name({ first: true , gender: "female" });
    const today = new Date();

    it('Adds a new user with bday today.', function(done) {
        request({          
            url: url + username3,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': today.toISOString().slice(0, 10)}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(204);
                done();
            });
    });

    it('Requests for a new user and checks bday.', function(done) {
        request.get(url + username3, function(error, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal('{"message":"Hello, ' + username3 + '! Happy birthday!"}');
            done();
        });
    });

    var username4 = random_name({ first: true , gender: "male" });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setYear(tomorrow.getFullYear() - 1);

    it('Adds a new user with bday tomorrow.', function(done) {
        request({          
            url: url + username4,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': tomorrow.toISOString().slice(0, 10)}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(204);
                done();
            });
    });
    
    it('Requests for a user and checks bday.', function(done) {
        request.get(url + username4, function(error, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal('{"message":"Hello, ' + username4 + '! Your birthday is in 1 day(s)"}');
            done();
        });
    });

    var username5 = random_name({ last: true , gender: "female" });
    const yesturday = new Date();
    yesturday.setDate(today.getDate() -1);

    it('Adds a user with bday yesturday.', function(done) {
        request({          
            url: url + username5,      
            method: "PUT",                        
            headers: {                             
                "content-type": "application/json",
                },
            json: true,
            body: {'dateOfBirth': yesturday.toISOString().slice(0, 10)}
            }, function (error, res, body) {         
                expect(res.statusCode).to.equal(204);
                done();
            });
    });

    var next_bday = new Date(yesturday);
    next_bday.setYear(today.getFullYear() + 1);
    const diff = next_bday - today
    const days = Math.floor(diff / (24*60*60*1000));

    it('Requests for a user and checks bday.', function(done) {
        request.get(url + username5, function(error, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal('{"message":"Hello, ' + username5 + '! Your birthday is in ' + days + ' day(s)"}');
            done();
        });
    });
});

