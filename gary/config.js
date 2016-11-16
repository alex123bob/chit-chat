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

        socket.on('userLogin', (data) => {
            players[data.username] = data;
            status[data.username] = 'normal';
            userInfoBySocketId[socket.id] = {
                username: data.username, 
                nickname: data.nickname
            };
            sockets[data.username] = socket;
            io.emit('userLogin', players);
            console.log(players);
        });

        socket.on('userUpdate', (data) => {
            if (data) {
                players[data.username].coor = data.coor;
            }
            io.emit('userUpdate', players);
        });

        socket.on('userLogout', (data) => {
            console.log('user: ' + data.nickname + ' has left.');
            socket.emit('userLogout', data);
            socket.broadcast.emit('userLogout', data);
        });

        socket.on('disconnect', (data) => {
            let userInfo = userInfoBySocketId[socket.id];
            delete players[userInfo.username];
            delete status[userInfo.username];
            delete sockets[userInfo.username];
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