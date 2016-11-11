'use strict';

if (process.argv.length != 4) {
    console.log('you have to put two parameters as username and nickname respectively.');
}
else {
    let username = process.argv[2],
        nickname = process.argv[3];
    let io = require('socket.io-client'),
        socket = io('http://localhost:3000/');

    socket.on('connect', () => {
        socket.emit('userLogin', {
            username: username,
            nickname: nickname
        });
    });
}