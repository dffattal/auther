var router = require('express').Router();
var User = require('./users/user.model');


router.get('/me', function(req, res, next) {
  if(req.session.userId) {
    User.findById(req.session.userId)
    .then(currentUser => {
      res.status(200).send(currentUser)
    })
    .catch(next)
  }
  else {
    res.sendStatus(204)
  }
})

module.exports = router
