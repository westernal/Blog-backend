const HttpError = require("../models/http-error");
const Post = require("../models/posts");
const User = require('../models/user');


const { validationResult } = require("express-validator");

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;

  try {
    post = await Post.findById(postId);
  } catch (error) {
    
    return next(error);
  }

  if (!post) {
    
    return next(error);
  }

  res.json({ post: post.toObject({ getters: true }) });
};

const getPostByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let posts;

  try {
    posts = await posts.find({ creator: userId });
  } catch (error) {
    const err = new HttpError("Could not find the post!", 500);
    return next(err);
  }

  if (!posts) {
    const err = new HttpError("Could not find the post!", 500);
    return next(err);
  }

  res.json({ posts: posts });
};

const createPosts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs", 422);
  }
  const { title, description, creator } = req.body;

  const createdPost = new Post({
    title: title,
    description: description,
    image: req.file.path,
    creator: creator,
  });

  let user

  try {
    user = await User.findById(creator)
    console.log(user);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    const err = new HttpError("Could not find user!", 422);
    return next(err);
  }

  try {
    await createdPost.save();
    user.posts.push(createdPost)
    await user.save()
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ post: createdPost });
};

const deletePost = async (req, res, next) => {

  const postId = req.params.pid;
  
  let post;

  try {
    post = await Post.findById(postId).populate('creator');
  } catch (error) {
    return next(error);
  }

  try {
    await post.remove();
    post.creator.posts.pull(post)
    await post.creator.save()
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Post Deleted!" });
};

exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPosts = createPosts;
exports.deletePost = deletePost;
