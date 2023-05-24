const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
describe('MongoDB Connection', function () {
    it('should connect to the database', function (done) {
        this.timeout(10000);
      MongoClient.connect('mongodb://localhost:27017/Communicion', function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        db.close();
        done();
      });
    });
  });