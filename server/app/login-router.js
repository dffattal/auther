'use strict';

var router = require('express').Router();
var User = require('../api/users/user.model')

router.post('/', function(req, res, next) {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(function(user) {
    if(!user) {
      return res.sendStatus(401)
    }
    req.session.userId = user.id
    res.status(200).send(user)
  })
  .catch(next)
})

router.get('/logout', function(req, res, next) {
  req.session.userId = null
  res.sendStatus(200)
})

module.exports = router
