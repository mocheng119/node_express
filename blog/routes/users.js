var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
/* GET users listing. */
router.get('/', function(req, res) {
    User.get(req.session.user.name, function(err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            console.log(user);
            return res.redirect('/');
        }
        Post.get(user.name, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
            });
            req.session.user.name = user.name;
        });
    });
});

module.exports = router;
