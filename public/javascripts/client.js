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
            var val = $('#m').val();
            if (!val.trim()) {
                return false;
            }
            socket.emit('message', val);
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
            var inputVal = $('#m').val();
            // we don't regard ENTER as the source of input event.
            if (ev.keyCode !== 13) {
                socket.emit('input', inputVal);
            }
        });

        // internal event
        socket.on('connect', function () {
            socket.emit('join', name);
        });

        socket.on('msg', function (msg) {
            $('#messages').append($('<li>').html(msg.replace(/\s/gi, '&nbsp;')));
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
            $hint.html(msg);
            $hint.data('ids', clearTimer($hint.data('ids')));
            
            var timerId = setTimeout(function (){
                $hint.html('');
            }, 1000);

            $hint.data('ids').push(timerId);
        });
    }
});