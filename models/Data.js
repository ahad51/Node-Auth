const mongoose = require('mongoose');

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
        default: 'defaultdhgbdiugd',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const Data = mongoose.model('Data', dataSchema);
module.exports = Data;

