'use strict';

var router = require('express').Router();
var User = require('../api/users/user.model')

router.post('/', function(req, res, next) {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.passwrod
    }
  })
  .then(function(user) {
    if(!user) {
      return res.sendStatus(401)
    }
    req.session.userId = user.id
    res.sendStatus(204)
  })
  .catch(next)
})

module.exports = router
