const express = require("express");
const dotenv = require("dotenv").config();
const ConnectDb = require("./config/dbconnect");
const {errorHandler}  = require("./middleware/errorHandler");
var bodyParser = require('body-parser');

ConnectDb();
const app = express();
const port = process.env.PORT;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(errorHandler);
app.listen(port, () => {
    console.log("Connection to server established");
    });

app.use("/users/",require("./routes/userRoutes"))
app.use("/customers/",require("./routes/custRoutes"))
app.use("/rest",require("./routes/restRoutes"))