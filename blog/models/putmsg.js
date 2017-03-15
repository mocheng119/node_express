var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var putmsgSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
});
mongoose.connection.on('connected', function() {
    console.log('一连接');
});
mongoose.connection.on('error', function(err) {
    console.log('异常' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('失去连接');
});
module.exports = mongoose.model('putMsg', putmsgSchema);
