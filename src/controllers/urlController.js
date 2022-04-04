const urlModel = require("../Models/urlModel");
const validUrl = require('valid-url')
const shortId = require('shortid')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

const createUrl = async function (req, res) {
    try {
        let data = req.body

        let { longUrl } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "request body can't be empty, BAD REQUEST" })
        }
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, msg: "longUrl is required " })
        }
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, msg: "longUrl is not a valid url" })
        }
        if (!(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(longUrl))) {
            return res.status(400).send({ status: false, msg: "longUrl is not a valid url" })
        }
        let urlCode = shortId.generate()
        let isUrlCodeIsAlreadyUsed = await urlModel.findOne({ urlCode })
        if (isUrlCodeIsAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "this urlcode is already used please enter another urlCode" })
        }


        let baseUrl = 'http://localhost:3000'
        let shortUrl = baseUrl + '/' + urlCode
        // let isShortUrlAlreadyUsed = await urlModel.findOne({ shortUrl })
        // if (isShortUrlAlreadyUsed) {
        //     return res.status(500).send({ status: false, msg: "server error" })
        // }
        let urlToBeCreated = { urlCode: urlCode, longUrl, shortUrl: shortUrl }
        let createNewUrl = await urlModel.create(urlToBeCreated)
        return res.status(201).send({ status: true, msg: "url created successfully", data: createNewUrl })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


const redirectUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode

        //  if(!isValid(urlCode)) {
        //      return res.status(400).send({status: false, msg: "urlCode is required"})
        //  }
        let urlDetails = await urlModel.findOne({ urlCode: urlCode })
        // JSON.stringify(urlDetails)
        if (!urlDetails) {
            return res.status(404).send({ status: false, msg: "urlCode not exist" })
        }
        return res.status(200).redirect(urlDetails.longUrl)

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createUrl = createUrl
module.exports.redirectUrl = redirectUrl
