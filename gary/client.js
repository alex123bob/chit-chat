'use strict';

var io = require('socket.io-client'),
    socket = io('http://localhost:3000/');

socket.on('connect', function (){
    console.log(arguments);
});