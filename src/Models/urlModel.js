const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({

    urlCode: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    longUrl: {
        type: String,
        required: true,
        trim: true,
        match: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true});

module.exports = mongoose.model('url', urlSchema)