'use strict';
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.set('views', '../views/');
app.set('view engine', 'jade');
app.use(express.static('../public/'));
app.use('/frontend_libs', express.static('../node_modules/'));

app.get('/', function (req, res, next){
    res.render('chat');
});

io.on('connection', function (client){
    console.log('a user connected');
    client.on('login', function (data){

    });

    client.on('message', function (msg){
        console.log('message from client: ' + msg);
    });
    
    client.on('disconnect', function (){
        console.log('user has been disconnected');
    });
});



server.listen(3000);
console.log('server is listening on port 3000');