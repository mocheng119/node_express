var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');
var limits = require('limits');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var msgpost = require('./routes/post');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var messagehome = require('./routes/messagehome');
var uploadimg = require('./routes/uploadimg');
var putmsg = require('./routes/putmsg');

var limits_config = {
    enable: true,
    file_uploads: true,
    post_max_size: 200000
};
var app = express();

//open 数据库
mongoose.connect('mongodb://localhost/microblog');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('photos', __dirname + '/public/photos');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(flash());
app.use(limits(limits_config));
app.use(function(req, res, next) {
    console.log("app.usr local");
    // res.locals.errors = req.flash('error');
    // res.locals.infos = req.flash('info');
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    var success = req.flash('success');
    res.locals.error = error.length ? error : null;
    res.locals.success = success.length ? success : null;
    next();
});


//use router
app.use('/', index);
app.use('/u/:user', users);
app.use('/post', msgpost);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);
app.use('/messagehome', messagehome);
app.use('/photo', uploadimg);
app.use('/putmsg', putmsg);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
//SQL注入攻击
