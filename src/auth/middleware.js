'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) =>{
  try{
    let [authType, authString] = req.headers.authorization.split(/\s+/);

    switch (authType.toLowerCase()){
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();

    }
  }catch(e){
    _authError();
  }

  function _authBasic(str){
    let base64Buffer = Buffer.from(str, 'base64');
    let bufferString = base64Buffer.toString();
    let [username, password] = bufferString.split(':');
    let auth = {username, password};
    // console.log(auth);
    return User.authenticateBasic(auth)
    .then(user => _authenticate(user))
    .catch(_authError);
  }

  function _authBearer(authString){
    return User.authenticateToken(authString)
    .then(user => _authenticate(user))
    .catch(_authError);
  }

  function _authenticate(user){
    if(user){
      req.user = user;
      req.token = user.generateToken();
      next();
    }else{
      _authError();
      console.log('error statement')
    }
  }

  function _authError(){
    next('Invalid User ID/Password');
  }
};