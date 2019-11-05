'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const mongoose = require('mongoose');

const errHandler = require('./middleware/error.js')
const notFound = require('./middleware/404.js')

const app = express();

const router = require('./auth/router.js');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);
app.use(notFound);
app.use(errHandler);

module.exports= {
  server: app,
  start: (PORT => {
    app.listen(3000, ()=> {
      console.log(`server up on ${PORT}`);
    })
  })
}