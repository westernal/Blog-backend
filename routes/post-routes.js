const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const postControllers = require("../controllers/post-controllers");
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get("/:pid", postControllers.getPostById);

router.get("/user/:uid", postControllers.getPostByUserId);

router.use(checkAuth)

router.post(
  "/",
  fileUpload.single('image'),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  postControllers.createPosts
);

router.delete("/:pid", postControllers.deletePost);
 
module.exports = router;
