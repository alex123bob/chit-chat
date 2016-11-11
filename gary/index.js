'use strict';

var setupSocket = require('./config'),
    http = require('http'),
    server = http.createServer();

setupSocket.setupSocket(server);

server.listen(3000);
console.log('server is listening at portal 3000');