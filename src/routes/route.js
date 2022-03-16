const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController");
const blogModel = require('../models/blogModel');
const middleware= require("../middlewares/auth")





router.post("/createAuthor", authorController.createAuthor)
router.post("/createBlog/:authorId",middleware.authentication,middleware.authorization, blogController.createBlog)
router.get("/blogs/:authorId"    ,middleware.authentication,  middleware.authorization,  blogController.getBlogs)
router.put("/blogs/:blogId/:authorId",   middleware.authentication,middleware.authorization, blogController.updateBlog)
router.delete("/blogs/:blogsId/:authorId",  middleware.authentication, middleware.authorization,  blogController.deleteBlog)
router.delete("/blog/:authorId",  middleware.authentication, middleware.authorization,  blogController.deleteByQueryParam)
router.post("/login", authorController.loginAuthor)




module.exports = router;