var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
    console.log(req.session.user);
    User.get(null, function(err, users) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/messagehome');
        }
        res.render('messagehome', {
            title: 'Express',
            username: req.session.user.name,
            users:users
        });
    });
});
router.post('/',function(req,res,next){
    
})
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
module.exports = router;
