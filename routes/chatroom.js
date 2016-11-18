'use strict';

const express = require('express'),
      router = express.Router();

router.get('/:roomId', function (req, res, next){
    res.render('chat', {title: 'chit-chat'});
});

module.exports = router;