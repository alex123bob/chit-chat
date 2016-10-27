'use strict';

var express = require('express');
var router = express.Router();

router.use('/category/:ctId', function (req, res, next){
  req.output = 'the request category Id is: ' + req.params.ctId + '\n';
  next();
});

router.get('/category/:ctId', function (req, res, next){
  if (req.params.ctId == 1) {
    next('route');
  }
  else {
    next();
  }
}, function (req, res, next){
  res.send(req.output.replace(/\n/gi, '<br />'));
});

router.get('/category/:ctId', function (req, res, next){
  res.send('you are our first user whose id is 1');
});

module.exports = router;
