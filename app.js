const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/post-routes");
const usersRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);


app.use((req, res, next) => {
  const error = new HttpError("Not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSet) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Error" });
});

mongoose.connect(
    'mongodb://127.0.0.1:27017/blog'
).then(() => {
    console.log('Connected!');
}).catch(() => {
    console.log('Connection Failed!');
})
app.listen(5000);