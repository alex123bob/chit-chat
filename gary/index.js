'use strict';

var config = require('./config'),
    http = require('http'),
    server = http.createServer();

config.setupSocket(server);

server.listen(3000);
console.log('server is listening at portal 3000');