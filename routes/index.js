var express = require('express');
var router = express.Router();

var rooms = [
  {
    name: 'room1',
    number: 0
  },
  {
    name: 'room2',
    number: 0
  },
  {
    name: 'room3',
    number: 0
  },
  {
    name: 'room4',
    number: 0
  },
  {
    name: 'room5',
    number: 0
  },
  {
    name: 'room6',
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
