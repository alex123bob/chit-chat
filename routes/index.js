var express = require('express');
var router = express.Router();

var rooms = [
  {
    name: 'chatting room',
    number: 0
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    rooms: rooms
  });
});

module.exports = router;
