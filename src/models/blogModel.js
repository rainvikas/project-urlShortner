const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const moment= require('moment')



const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "author"
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subCategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null

    },
        
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt:{ 
        type: Date,
        default: null
    }
},
{timestamps: true});






module.exports= mongoose.model('blog', blogSchema)