const blogModel = require("../models/blogModel")
const authorModel = require("../models/AuthorModel")
const moment = require('moment')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createBlog = async function (req, res) {
    try {
        let data = req.body
        const { title, body, authorId, tags, category, subCategory, isPublished } = data

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "title is required" })
            return
        }
        if (!isValid(body)) {
            res.status(400).send({ status: false, msg: "body is required" })
            return
        }
        if (!isValid(authorId)) {
            res.status(400).send({ status: false, msg: "authorId is required" })
            return
        }
        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, msg: "authorId is not a vlaid authorId" })
            return
        }
        if (!isValid(tags)) {
            res.status(400).send({ status: false, msg: "tags is required" })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, msg: "category is required" })
            return
        }

        let authorDetails = await authorModel.findById(authorId)
        if (!authorDetails) {
            return res.status(404).send({ status: false, msg: "author id not exist" })
        }
        if (isPublished == true) {
            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let blogData = { title, body, authorId, tags, category, subCategory, isPublished, publishedAt: Date };
            let blogCreated = await blogModel.create(blogData)
            res.status(201).send({ status: true, data: blogCreated })
        } else {
            let blogCreated = await blogModel.create(data)
            res.status(201).send({ status: true, data: blogCreated })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}

const getBlogs = async function (req, res) {
    try {


        let data = req.query

        let { authorId, category, tags, subCategory } = data

        let blogsDetails = await blogModel.find({ isDeleted: false, isPublished: true, $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subCategory: subCategory }] })
        if (!blogsDetails) {
            res.status(404).send({ status: false, msg: "no blog exist" })

        } else {
            res.status(200).send({ status: true, data: blogsDetails })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let data = req.body

        let { title, body, tags, subCategory } = data

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "title need to be updated" })
            return
        }
        if (!isValid(body)) {
            res.status(400).send({ status: false, msg: "body need to be updated" })
            return
        }
        if (!isValid(tags)) {
            res.status(400).send({ status: false, msg: "tags need to be updated" })
            return
        }
        if (!isValid(subCategory)) {
            res.status(400).send({ status: false, msg: "subCategory need to be updated" })
            return
        }
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, msg: "blogId is not a valid blogId" })
            return
        }

        let blogDetails = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "details not exist" })
            return
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

            await blogModel.findOneAndUpdate({ _id: blogId }, { title: title, body: body, $addToSet: { tags: tags, subCategory: subCategory }, $set: { isPublished: true, publishedAt: Date }, new: true })
            let updatedDetails = await blogModel.find({ _id: blogId })
            res.status(201).send({ status: true, data: updatedDetails })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValid(blogId)) {
            res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
            return
        }
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, msg: "blogId is not a vlaid blogId" })
        }
        let blogDetails = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "details not exist" })
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let blogDetails = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date } })
            res.status(201).send({ msg: "blog deleted" })

        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const deleteByQueryParam = async function (req, res) {
    try {

        let data = req.query
        let { authorId, category, tags, subCategory, isPublished } = data


        if (!isValid(authorId)) {
            res.status(400).send({ status: false, msg: "authorId is required, BAD REQUEST" })
            return
        }
        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, msg: "authorId is not a valid authorId" })
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, msg: "category is required, BAD REQUEST" })
            return
        }
        if (!isValid(tags)) {
            res.status(400).send({ status: false, msg: "tag is required, BAD REQUEST" })
            return
        }
        if (!isValid(subCategory)) {
            res.status(400).send({ status: false, msg: "subCategory is required , BAD REQUEST" })
            return
        }


        let authorDetails = await authorModel.find({ _id: authorId, isDeleted: false, isPublished: true })
        if (!authorDetails) {
            res.status(404).send({ status: false, msg: "details not exist" })
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let updatedDetails = await blogModel.updateMany({ authorId: authorId, category: category, tags: tags, subCategory: subCategory }, { $set: { isDeleted: true, deletedAt: Date } })
            res.status(201).send({ status: true, msg: "blogs deleted" })
        }

    }
    catch (error) {
        console.log(error)
        res.staatus(500).send({ msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteByQueryParam = deleteByQueryParam