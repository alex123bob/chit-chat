'use strict';

$(function (){
    $('.room').each(function (index, el){
        $(el).click(function (ev){
            var url = location.href;
            location.href = url + 'room/' + $(el).text();
        });
    });
});