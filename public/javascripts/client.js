'use strict';

$(function () {
    var name = prompt('Please enter your nick name in the chat room:😄'),
        flag = !! name;
    
    if (!flag) {
        alert('we must input something.');
    }
    else {
        // establish connection.
        var socket = io();

        // this is used to emit message event to server side.
        var sendMsg = function () {
            socket.emit('message', $('#m').val());
            $('#m').val('');
        }

        // emit quit to server side
        var quit = function () {
            socket.emit('quit');
        }

        $('form').on('submit', function (ev) {
            ev.preventDefault();
        });

        $('.quit,.send').on('click', function (ev) {
            ev.stopPropagation();
            var targetEl = ev.target,
                cls = targetEl.getAttribute('class');
            if ('send' == cls) {
                sendMsg();
            }
            else if ('quit' == cls) {
                quit();
            }
        });

        $('#m').on('keydown', function (ev) {
            socket.emit('input', $('#m').val());
        });

        // internal event
        socket.on('connect', function () {
            socket.emit('join', name);
        });

        socket.on('msg', function (msg) {
            $('#messages').append($('<li>').text(msg));
        });

        var clearTimer = function (ids){
            if ($.isArray(ids)) {
                ids.forEach(function (id, index, self){
                    clearTimeout(id);
                });
            }
            return [];
        }

        socket.on('input', function (msg){
            var $hint = $('.hint');
            $hint.text(msg);
            $hint.data('ids', clearTimer($hint.data('ids')));
            
            var timerId = setTimeout(function (){
                $hint.text('');
            }, 1000);

            $hint.data('ids').push(timerId);
        });
    }
});