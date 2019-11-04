'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

module.exports= {
  server: app.use,
  start: (PORT => {
    app.listen(3000, ()=> {
      console.log(`server up on ${PORT}`);
    })
  })
}