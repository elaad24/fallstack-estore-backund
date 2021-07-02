// know to show non fatel errors of server in browser
const createError = require("http-errors");
// the model the make the server run
const express = require("express");
// model that handel the url req
const path = require("path");

// allow all cors req - solve the core problem
const cors = require("cors");

// import the brain of the server by addres
const indexRouter = require("./routes/index");
const users = require("./routes/users");
const auth = require("./routes/auth");
const products = require("./routes/products");
const shoppingCart = require("./routes/shoppingCarts");

const app = express();

const http = require("http").Server(app);

// set that all the info that enter to express and move trow the express function will be in json pormat
app.use(express.json({ limit: "50mb" }));

app.use(cors());

const mongoose = require("mongoose");

mongoose

  //  local host
  //.connect("mongodb://localhost/e_store_server", {
  .connect(
    secret.DATABASE_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("Could not connect to MongoDB.."));

// here set the routes that run in express
app.use("/", indexRouter);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/shoppingCart", shoppingCart);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = 500;
http.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
