const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: { type: String, index: true, unique: true, required: true },
    dateOfBirth: { type: Date, required: true }
});

var user = new mongoose.model('User', schema);

module.exports = user;
