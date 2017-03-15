var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
    req.session.user = null;
    req.flash('success', '退出成功');
    res.redirect('/');
});

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

module.exports = router;
