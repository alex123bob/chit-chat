'use strict';

const io = require('socket.io')();

let players = {},
    userInfoBySocketId = {},
    sockets = {},
    status = {};

exports.setupSocket = function(server) {
    io.attach(server, {
        'log level': 0
    });
    
    io.on('connection', function(socket) {
        socket.on('userMessage', function(data) {
            socket.emit('userMessage', data);
            socket.broadcast.emit('userMessage', data);
        });

        socket.on('userLogin', function(data) {
            socket.emit('usersInit', players);
            players[data.username] = data;
            status[data.username] = 'normal';
            userInfoBySocketId[socket.id] = {
                username: data.username, 
                nickname: data.nickname
            };
            sockets[data.username] = socket;
            io.emit('userLogin', data);
        });

        socket.on('userUpdate', function(data) {
            players[data.username] = data;
            io.emit('userUpdate', data);
        });
        socket.on('userLogout', function(data) {
            console.log('user: ' + data.nickname + ' has left.');
            socket.emit('userLogout', data);
            socket.broadcast.emit('userLogout', data);
        });
        socket.on('connect', function(data) {
            console.log('user: ' + data.nickname + ' connected.');
        });
        socket.on('disconnect', function(data) {
            console.log(data);
        });
        socket.on('sendChallenge', function(data) {
            var sender = players[data.sender.username];
            var receiver = players[data.receiver.username];
            if (status[data.receiver.username] == 'challenge') {
                socket.emit('challengeNotAvailable', receiver);
            } 
            else {
                status[data.sender.username] = 'challenge';
                status[data.receiver.username] = 'challenge';
                socket.emit('waitingChallengeAccept', receiver);
                sockets[data.receiver.username].emit('challengeAccept', sender);
            }
        });
    });
}