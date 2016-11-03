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

app.get('/:roomId', function (req, res, next) {
    res.render('chat', {title: 'chit-chat'});
});

var rooms = {};

io.on('connection', function (socket) {
    var url = socket.request.headers.referer; // get url from client request.
    url = url.split('/');
    var roomId = url[url.length - 1],
        user = '';

    socket.on('join', function (userName){
        user = userName;
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        rooms[roomId].push(userName);
        socket.join(roomId);
        io.to(roomId).emit('msg', userName + ' just joins the room ' + roomId);
    });

    // check if current user is still in the chatting room or not.
    function online (){
        return rooms[roomId].indexOf(user) !== -1;
    }

    // internal event
    socket.on('message', function (msg) {
        if (!online()) {
            return false;
        }
        // if so, only others in the room(id is roomId) can accept this msg and exclude the sender itself.
        // socket.broadcast.to(roomId).emit('msg', msg);

        // in this way, we can send current msg to all users in the specific room with roomId.
        io.to(roomId).emit('msg', user + ': ' + msg);
    });

    socket.on('quit', function (){
        if (!online()) {
            return false;
        }
        socket.emit('disconnect');
    });

    // internal event
    socket.on('disconnect', function () {
        var index = rooms[roomId].indexOf(user);
        if (-1 !== index) {
            rooms[roomId].splice(index, 1);
        }
        // leaves room.
        socket.leave(roomId);
        io.to(roomId).emit('msg', user + ' leaves room "' + roomId + '".');
    });

    socket.on('input', function (inputVal){
        // if user is not online, we are not gonna send input event to any other user.
        if (!online()) {
            return false;
        }
        socket.broadcast.to(roomId).emit('input', user + ' is inputing...');
    });
});



server.listen(3000);
console.log('server is listening on port 3000');