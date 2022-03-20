const jwt = require('jsonwebtoken')
const blogModel = require("../models/blogModel")



const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            res.status(401).send({ status: false, msg: " token is required" })
        }

        let decodedToken = jwt.verify(token, "Room No-38")
        if (!decodedToken) {
            return res.status(401).status({ status: false, msg: "token is invalid" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}


let authorization = async function (req, res, next) {
    try {
        let authorId = req.params.blogId

        if (!authorId) {
            res.status(400).send({ status: false, msg: " Id is required, BAD REQUEST" })
        }
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "Room No-38")
        let blogDetails = await blogModel.findById(authorId)
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "id not found" })
        }
        if (decodedToken.authorId != blogDetails.authorId) {
            return res.status(403).send({ status: false, msg: "you are not authorized" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization