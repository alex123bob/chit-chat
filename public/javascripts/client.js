var socket = io();

$(function () {
    $('form').on('submit', function (ev) {
        ev.preventDefault();
        socket.emit('message', $('#m').val());
        $('#m').val('');
    });

    $('#m').on('keydown', function (ev){
        socket.emit('input', $('#m').val());
    });

    socket.on('message', function (msg){
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('enter', function (msg){
        $('#messages').append($('<li>').text(msg));
    })
});