'use strict';

const io = require('socket.io')();

let players = {},
    userInfoBySocketId = {},
    sockets = {},
    status = {};

exports.setupSocket = (server) => {
    io.attach(server, {
        'log level': 0
    });
    
    io.on('connection', (socket) => {
        socket.on('userMessage', (data) => {
            socket.emit('userMessage', data);
            socket.broadcast.emit('userMessage', data);
        });

        // user connects to server
        socket.on('join', (obj) => {
            console.log(obj.userName + ' connects to this server, his nickname is ' + obj.nickName);
        });

        socket.on('userLogin', (data) => {
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

        socket.on('userUpdate', (data) => {
            players[data.username] = data;
            io.emit('userUpdate', data);
        });

        socket.on('userLogout', (data) => {
            console.log('user: ' + data.nickname + ' has left.');
            socket.emit('userLogout', data);
            socket.broadcast.emit('userLogout', data);
        });

        // emit disconnect to notify socket server that someone has been disconnected.
        socket.on('quit', (data) => {
            socket.emit('disconnect', data);
        });

        socket.on('disconnect', (data) => {
            console.log(data);
        });

        socket.on('sendChallenge', (data) => {
            let sender = players[data.sender.username],
                receiver = players[data.receiver.username];
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