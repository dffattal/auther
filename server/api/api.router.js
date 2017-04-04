'use strict';

var router = require('express').Router();

router.use('/auth', require('./auth'))

router.use('/users', require('./users/user.router'));

router.use('/stories', require('./stories/story.router'));

module.exports = router;
