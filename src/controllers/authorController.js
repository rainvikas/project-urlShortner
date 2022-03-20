const authorModel = require("../models/AuthorModel")
const jwt = require('jsonwebtoken')


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', "Miss"].indexOf(title) !== -1
}

const createAuthor = async function (req, res) {
    try {
        let data = req.body

        let { firstName, lastName, title, email, password } = data

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(firstName)) {
            res.status(400).send({ status: false, msg: "firstName is required" })
            return
        }
        if (!isValid(lastName)) {
            res.status(400).send({ status: false, msg: "lastName is required" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "title is required" })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, msg: "title should be amoung Mr,Mrs,Miss" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should be valid email address" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" })
            return
        }
        let isEmailAlreadyUsed = await authorModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "email already used" })
        }

        else {
            let createdAuthor = await authorModel.create(data)
            res.status(201).send({ data: createdAuthor })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}

const loginAuthor = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should be valid email address" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" })
            return
        }

        let authorDetails = await authorModel.findOne({ email: email, password: password })
        if (!authorDetails)
            res.status(404).send({ status: false, msg: "email & password not matched" })
        else {
            let token = jwt.sign({ authorId: authorDetails._id }, "Room No-38")
            res.setHeader("x-api-key", token);
            res.status(201).send({ status: true, data: token })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor