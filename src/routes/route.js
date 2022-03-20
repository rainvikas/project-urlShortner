const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController");
const blogModel = require('../models/blogModel');
const middleware= require("../middlewares/auth")





router.post("/createAuthor", authorController.createAuthor)
router.post("/login", authorController.loginAuthor)
router.post("/createBlog",middleware.authentication   ,blogController.createBlog)
router.get("/blogs"    ,middleware.authentication, blogController.getBlogs)
router.put("/blogs/:blogId",middleware.authentication,middleware.authorization, blogController.updateBlog)
router.delete("/blogs/:blogId",  middleware.authentication, middleware.authorization,  blogController.deleteBlog)
router.delete("/blog",  middleware.authentication,  blogController.deleteByQueryParam)
router.post("/login", authorController.loginAuthor)




module.exports = router;