'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// require('./roles-model.js');

const SECRET = process.env.SECRET;

const user = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, require: true},
  email: {type: String},
  role: {type: String, default: 'user', enum: ['admin', 'editor', 'user']},
});

const images = new mongoose.Schema({
  title: {type: String},
  user_id: {type: String},
  description: {type: String},
  url: {type: String},
  created_at: {type: Date},

});

const capabilities = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

//  user.statics.authenticateToken = function(token){
//  if (usedTokens.has(token)){
//    return Promise.reject('invalid token')
//  }

//  try {
//     let parsedToken = jwt.verify(token, SECRET);
//     (SINGLE)

user.pre('save', async function(){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
});


user.statics.authenticateBasic = function(auth){
  // console.log(auth);
  let query = {username: auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => {throw error;})
    .then(console.log(auth, query));
};
  
user.statics.authenticateToken = function(token){
  try {
    let parsedToken = jwt.verify(token, SECRET);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { throw new Error('Invalid Token'); 
  }};

user.methods.comparePassword =function(password){
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this: null);
};

user.methods.generateToken = function(type){
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };
  let options = {};
  return jwt.sign(token, SECRET, options);
};


user.methods.can = function(capability){
  return capabilities [this.role].include(capability);
};

user.methods.generateKey = function(){
  return this.generateToken('key');
};

module.exports = mongoose.model('user', user);