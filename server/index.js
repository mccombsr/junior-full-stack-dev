require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const massive = require("massive");

const app = express();
app.enable("trust proxy");
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

// Destructure from process.env
const { SERVER_PORT, CONNECTION_STRING } = process.env;

// Connect to DB
massive(CONNECTION_STRING)
  .then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Connected to DB");
  })
  .catch(err => {
    console.log(err);
  });

//ENDPOINTS
//Check if ip has already rated this quote
app.get(`/api/get-users-rating/:quote`, async (req, res) => {
  let { quote } = req.params;
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("Old IP: ", req.ip, "quote: ", quote, "New IP: ", ip);
  const db = req.app.get("db");
  let usersRating = await db.get_users_rating([quote, ip]);
  console.log("usersRating", usersRating);
  res.send(usersRating);
});

// GET rating average
app.get(`/api/get-rating-avg/:quote`, async (req, res) => {
  let { quote } = req.params;
  // console.log(quote);

  const db = req.app.get("db");
  let avgRating = await db.get_rating_avg([quote]);
  console.log("Rating Average: ", avgRating);
  res.send(avgRating);
});

//POST new rating
app.post(`/api/new-rating/:rating/:quote`, async (req, res) => {
  // console.log('New rating posted!!!')
  let { rating, quote } = req.params;
  // console.log(quote, req.ip, rating);
  const db = req.app.get("db");
  let newRating = await db.post_rating([quote, req.ip, rating]);
  res.sendStatus(200);
});

app.listen(SERVER_PORT, () => {
  console.log(`Port ${SERVER_PORT} is spreading the wisdom...`);
});
