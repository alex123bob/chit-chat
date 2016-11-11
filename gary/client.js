'use strict';

if (process.argv.length != 4) {
    console.log('you have to put two parameters as username and nickname respectively.');
}
else {
    let userName = process.argv[2],
        nickName = process.argv[3];
    let io = require('socket.io-client'),
        socket = io('http://localhost:3000/');

    socket.on('connect', () => {
        socket.emit('join', {
            userName: userName,
            nickName: nickName
        });
    });
}