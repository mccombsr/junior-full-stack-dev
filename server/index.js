require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const massive = require('massive');


const app = express();
app.use(bodyParser.json());
app.use( express.static( `${__dirname}/../build` ) );



// Destructure from process.env
const {
    SERVER_PORT,
    CONNECTION_STRING,
    SECRET,
} = process.env;

massive(CONNECTION_STRING)
    .then((dbInstance) => {
        app.set('db', dbInstance);
        console.log('Connected to DB')
    })
    .catch((err) => {
        console.log(err);
    })

//middleware
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))


app.listen(SERVER_PORT, () => {
    console.log(`Port ${SERVER_PORT} is spreading the wisdom...`)
});