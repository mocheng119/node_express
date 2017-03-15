var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var crypot = require('crypto');
var User = require('../models/user.js');

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}
/* GET home page. */
router.get('/', checkNotLogin);
router.get('/', function(req, res, next) {
    res.render(
        'reg', { title: '用户注册' }
    );
});
router.post('/', checkNotLogin);
router.post('/', urlencodedParser, function(req, res, next) {
    if (req.body.password != req.body.password2) {
        req.flash('error', '密码不一致');
        console.log(req.body.password);
        return res.redirect('/reg');
    }
    var md5 = crypot.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password
    });
    User.get(newUser.name, function(err, user) {
        if (user) {
            err = 'Username already exeist';
        }
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
});


module.exports = router;
