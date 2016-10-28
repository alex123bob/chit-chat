'use strict';
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')();

io.attach(server);
app.set('views', '../views/');
app.set('view engine', 'jade');
app.use(express.static('../public/'));
app.use('/frontend_libs', express.static('../node_modules/'));

app.get('/', function (req, res, next) {
    res.render('chat');
});

// io.use(function (socket, next){
//     if (socket.request.headers.cookie) {
//         console.log(socket.request.headers);
//         return next();
//     }
//     next(new Error('Authentication Failed'));
// });

io.on('connection', function (socket) {
    socket.emit('enter', socket.id + ' just enters this conversation');

    // console.log(socket.nsp.name);

    socket.on('message', function (msg) {
        socket.emit('message', msg);
    });

    socket.on('disconnect', function () {
        console.log('user has been disconnected');
    });

    socket.on('input', function (){
        console.log('user is inputing');
    });
});



server.listen(3000);
console.log('server is listening on port 3000');