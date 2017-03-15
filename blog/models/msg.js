var mongodb = require('./db');

function Msg(from,to,time,msgt,status) {
    this.from = from;
    this.to = to;
    this.time = time;
    this.msgt = msgt;
    this.status =status;
}
module.exports = Msg;
Msg.prototype.save = function save(callback) {
    var msg = {
        from: this.from,
        to: this.to,
        time: this.time,
        msgt: this.msgt,
        status: this.status
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        console.log('数据库连接');
        db.collection('msgs', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('time');
            collection.insert(msg, { safe: true }, function(err, msg) {
                mongodb.close();
                callback(err, msg);
            });
        });
    });
};
Msg.get = function get(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('msgs', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({ from: username }, function(err, doc) {
                mongodb.close();
                if (doc) {
                    var msg = new Msg(doc.from,doc.to,doc.time,doc.msgt,doc.status);
                    callback(err, msg);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};
