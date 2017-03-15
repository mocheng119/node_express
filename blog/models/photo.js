var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = new mongoose.Schema({
    username: String,
    name: String,
    path: String,
    uploadDate: Date
});
module.exports = mongoose.model('Photo', schema);
