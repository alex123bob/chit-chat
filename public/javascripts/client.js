'use strict';

$(function () {
    var name = prompt('Please enter your nick name in the chat room:😄'),
        flag = !!name,
        favicon= new Favico({
            position: 'up'
        }),
        badgeCount = 0,
        windowActivated = false;

    function windowFocusAndBlur(focus, blur) {
        // check if browser window has focus		
        var notIE = (document.documentMode === undefined),
            isChromium = window.chrome;
            
        if (notIE && !isChromium) {

            // checks for Firefox and other  NON IE Chrome versions
            $(window).on("focusin", function () { 

                // tween resume() code goes here
                setTimeout(function(){            
                    focus();
                },300);

            }).on("focusout", function () {
                blur();
            });

        } else {
            
            // checks for IE and Chromium versions
            if (window.addEventListener) {
                // bind focus event
                window.addEventListener("focus", function (event) {
                    // tween resume() code goes here
                    setTimeout(function(){                 
                        focus();
                    },300);
                }, false);

                // bind blur event
                window.addEventListener("blur", function (event) {
                    blur();
                }, false);

            } else {

                // bind focus event
                window.attachEvent("focus", function (event) {

                    // tween resume() code goes here
                    setTimeout(function(){                 
                        focus();
                    },300);

                });

                // bind focus event
                window.attachEvent("blur", function (event) {
                    blur();
                });
            }
        }
    }

    if (!flag) {
        alert('we must input something.');
    }
    else {
        windowFocusAndBlur(function (){
            windowActivated = true;
            badgeCount = 0;
            favicon.reset();
        }, function (){
            windowActivated = false;
        });
        $('#online_users').collapsible('accordion-open', {
            contentOpen: 3,
            collapseSpeed: 10,
            accordionUpSpeed: 10,
            accordionDownSpeed: 10
        });
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
        // meanwhile we'are gonna redirect to the homepage site.
        var quit = function () {
            var cfm = window.confirm('You sure you wanna quit ? ');
            if (cfm === true) {
                socket.emit('quit');
                var homepage = location.protocol + '//' + location.host;
                location.href = homepage;
            }
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

        // once the page loaded, we'd better focus cursor into input field
        $('#m').focus();

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

        // this monitor is used to refresh online users panel.
        socket.on('online_users', function (users){
            $('#online_users>div').find('p').remove();
            users.forEach(function (user, index, self){
                $('#online_users>div').append('<p>' + (index + 1) + '. ' + user + '</p>');
            });
        });

        socket.on('msg', function (msg) {
            $('#messages').append($('<li>').html(msg.replace(/\s/gi, '&nbsp;')));
            $('body').animate({
                scrollTop: $('ul li:last').offset().top
            }, 0);
            if (!windowActivated) {
                badgeCount += 1;
                favicon.badge(badgeCount);
            }
        });

        var clearTimer = function (ids) {
            if ($.isArray(ids)) {
                ids.forEach(function (id, index, self) {
                    clearTimeout(id);
                });
            }
            return [];
        }

        socket.on('input', function (msg) {
            var $hint = $('.hint');
            $hint.html(msg);
            $hint.data('ids', clearTimer($hint.data('ids')));

            var timerId = setTimeout(function () {
                $hint.html('');
            }, 1000);

            $hint.data('ids').push(timerId);
        });
    }
});