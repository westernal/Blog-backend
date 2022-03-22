const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require('path');

const postsRoutes = require("./routes/post-routes");
const usersRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }

  if (res.headerSet) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Error" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/blog")
  .then(() => {
    console.log("Connected!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });
app.listen(5000);
