var express = require('express');
var router = express.Router();
var putMsg = require('../models/putmsg.js');
/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {

    res.redirect('/');
});

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
var pMsg = new putMsg();
pMsg.title = '我是fsd标题';
pMsg.author = 'sdf杨雨鑫';
pMsg.body = 'sdfsdf我是Body';
pMsg.comments = [{
    body: 'girls',
    date: new Date()
}];
pMsg.hidden = false;
pMsg.meta = {
    votes: 2,
    favs: 88
};
var update = {
    _id: '58bcc1ed970d3a1a10cfd874',
    title: '我是更改过的标题',
    author: '我是更改过的作者',
    body: '我是更改过的身体',
    comments: [{
        body: 'update',
        date: new Date()
    }],
    hidden: false,
    meta: {
        votes: 99,
        favs: 88
    }
};
var options = {
    strict: false
};
// putMsg.update({}, update, options, function(err, rows_update) {
//     if (err)
//         console.log(err);
//     console.log('update complete!');
// });
// // pMsg.save(function(err) {
// //     if (err) {
// //         req.flash('error', '保存出错');
// //         console.log('baocun异常' + err);
// //     }
// //     req.flash('success', '保存成功');
// // });
// // putMsg.find({}, function(err, putmsgSchema) {
// //     console.log(putmsgSchema);
// // });
// // putMsg.find({'title':'我是标题'}, function(err, putmsgSchema) {
// //     console.log(putmsgSchema);
// // });
// putMsg.find({ '_id': '58bcc1ed970d3a1a10cfd874' }, function(err, delet) {
//     putMsg.remove(delet,function(err,res){
//         if(err)console.log(err);
//         else console.log('sucess'+res);
//     });
// });
// mongoose.connection.on('connected', function() {
//     console.log('一连接');
// });
// mongoose.connection.on('error', function(err) {
//     console.log('异常' + err);
// });
// mongoose.connection.on('disconnected', function() {
//     console.log('失去连接');
// });
module.exports = router;
