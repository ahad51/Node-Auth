const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        default: 'ahad',
        max: 255,
    },
    description: {
        type: String,
        required: true,
        default: 'dediughd',
        min: 6,
        max: 255,
    },
    picture: {
        type: String, 
        default: 'defaultdhgbdiugd'
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports.User = mongoose.model('User', userSchema);
