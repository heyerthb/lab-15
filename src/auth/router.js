'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model');
const auth = require('./middleware');

authRouter.post('/signup', (req, res, next) =>{
  let user = new User(req.body);
  user.save()
  .then((user) =>{
    req.token = user.generateToken();
    req.user = user;
    res.set('token', req.token);
    res.cookie('auth', req.token);
    res.send(req.token);  
  
  }).catch(next);
})

authRouter.post('/signin',auth,(req, res, next)=>{
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.post('/key',auth,(req, res, next)=>{
  let key = req.user.generateKey();
  res.status(200).send(key)
});

// authRouter.get('/images'{
// });
// authRouter.get('/image/:id'{
// });
// authRouter.get('/image/:userId'{
// });
// authRouter.get('/images'{
// });
// authRouter.post('/images'{
// });
// authRouter.put('/image/:id'{
// });
// authRouter.delete('/images/:id'{
// });


module.exports = authRouter;
