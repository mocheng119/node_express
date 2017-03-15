var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Photo = require('../models/photo.js');
var path = require('path');
var fs = require('fs');
var join = path.join;
/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
    Photo.find({ 'username': req.session.user.name }, function(err, photos) {
        var photosAll=[];
        photos.forEach(function(photo,index){
            console.log(photo.path);
            var urls=photo.path.split('public/');
            var imgurl=urls[urls.length-1];
            //console.log('相册的路径是'+imgurl);
            var username=photo.username;
            var name=photo.name;
            var uploadDate=photo.uploadDate;
            var pohotimg={
                url:imgurl,
                username:username,
                name:name,
                uploadDate:uploadDate
            };
            photosAll.push(pohotimg);
        });
        //console.log('所有的图片是'+photosAll);
        res.render('photo', {
            title: '上传图片',
            photosAll: photosAll,
        });
    });
});
router.post('/', function(req, res, next) {
    upload(req, res);
});

function checkLogin(req, res, next) {
    username = req.session.user;
    if (!username) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

function upload(req, res) {
    if ((!isFormData)) {
        res.statusCode = 400;
        res.end('Bad Request!');
        return;
    }
    var imgusername = req.session.user.name;
    console.log('yonghuming:' + imgusername);
    var form = new formidable.IncomingForm();
    //校验和
    form.multiples = false;
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "public/images/";
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制
    form.maxFieldsSize = 4 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和
    form.on('fileBegin', function(name, file) {
        file.name = imgusername + '_' + file.name;
        file.path = 'public/images/' + file.name;
        console.log('文件路径是' + file.path);
    });
    form.on('field', function(field, value) {
        console.log(field);
        console.log(value);
    });
    form.on('file', function(name, file) {
        console.log(name);
        console.log(file);
        //json形式写入数据必须同时写入_id
        userPhoto = new Photo();
        userPhoto.username = imgusername;
        userPhoto.name = file.name;
        userPhoto.path = file.path;
        userPhoto.uploadDate = new Date();
        userPhoto.save(function(err) {
            if (err) {
                console.log('保存至数据库出错' + err);
            } else {
                console.log('图片上传成功');
            }
        });
    });
    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log('上传完成度' + percent);
    });
    form.on('aborted', function() {
        console.log('文件拒绝访问！');
    });
    form.on('error', function(err) {
        console.log('上传出错' + err);
    });
    form.on('end', function() {
        console.log('upload complete!');
        req.flash('success', '上传成功');
        res.redirect('/photo');
    });
    form.parse(req);
}

function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
}
module.exports = router;
