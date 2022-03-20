const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users

  try {
    users = await User.find({}, '-password')
  } catch (error) {
    const err = new HttpError("Getting users failed!", 500);
    return next(err);
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) })
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs", 422);
  }

  const { name, email, password } = req.body;

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    const err = new HttpError("Signup failed!", 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError("User already exist!", 422);
    return next(err);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: password,
    image: 'url',
    posts: []
  })

  try {
    await createdUser.save()
  } catch (error) {
    const err = new HttpError("Signup failed!", 500);
    return next(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
};

const login = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    const err = new HttpError("Signup failed!", 500);
    return next(err);
  }

  if (!existingUser || existingUser.password !== password) {
    const err = new HttpError("Invalid inputs!", 401);
    return next(err);
  }

  res.json({ user: createdUser.toObject({ getters: true }) })
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
