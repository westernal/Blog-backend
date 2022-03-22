const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Getting users failed!", 500);
    return next(err);
  }

  res.json({ users: users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs", 422);
  }

  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(error);
  }

  if (existingUser) {
    const err = new HttpError("User already exist!", 422);
    return next(err);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(error);
  }

  const createdUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
    image: req.file.path,
    posts: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(error);
  }

  let token;

  try {
    token = jwt(
      { userId: createdUser.id, email: createdUser.email },
      "secret_key",
      { expires: "1h" }
    );
  } catch (error) {
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Signup failed!", 500);
    return next(err);
  }

  if (!existingUser) {
    const err = new HttpError("Invalid inputs!", 401);
    return next(err);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Password is empty.", 401);
    return next(error);
  }

  let token;

  try {
    token = jwt(
      { userId: existingUser.id, email: existingUser.email },
      "secret_key",
      { expires: "1h" }
    );
  } catch (error) {
    return next(error);
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
