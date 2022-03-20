const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const postControllers = require("../controllers/post-controllers");

router.get("/:pid", postControllers.getPostById);

router.get("/user/:uid", postControllers.getPostByUserId);

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  postControllers.createPosts
);

router.delete("/:pid", postControllers.deletePost);

module.exports = router;
