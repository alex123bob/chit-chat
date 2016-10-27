var socket = io();

$(function () {
    $('form').on('submit', function (ev) {
        ev.preventDefault();
        socket.emit('message', $('#m').val());
        $('#m').val('');
    });
});