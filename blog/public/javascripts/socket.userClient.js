$(function() {
    var socket = io();
    var from = $('#currentUser').attr('name');

    // 点击用户进行聊天
    $('.userForm').on('click', function() {
        var to = $(this).attr('to');
        $('.msgform').find('.modal-title').html(from + '和' + to + '的聊天');
        $('.msgform').find('.sendmsg').attr('from', from);
        $('.msgform').find('.sendmsg').attr('to', to);
        $('.msgform').modal('show');
    });

    // 更新对话框
    function updateMsgForm(message) {
        var chatmessages = $('.msgform').find('.chatmessages').val();
        chatmessages += message;
        $('.msgform').find('.chatmessages').val(chatmessages);
    }
    // 发送信息
    $('.sendmsg').on('click', function() {
        var to = $(this).attr('to');
        var msg = $('.message').val();
        if (from && to && msg) {
            socket.emit('chat message', from, to, msg);
            var message = from + " " + new Date().toLocaleString() + "\n" + msg + "\n";
            updateMsgForm(message);
            $('.message').val('');
        }
    });

    // 接收信息
    socket.on(from + '_message', function(from, msg, time) {
        var message = from + "  " + new Date(time).toLocaleString() + "\n" + msg + '\n';
        updateMsgForm(message);
    });

});
