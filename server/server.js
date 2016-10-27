'use strict';
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.set('views', '../views/');
app.set('view engine', 'jade');
app.use(express.static('../public/'));

app.get('/', function (req, res, next){
    res.render('chat');
});

io.on('connection', function (client){
    client.on('login', function (data){

    });

    client.on('message', function (){

    });
});

server.listen(3000);
console.log('server is listening on port 3000');