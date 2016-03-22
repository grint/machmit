var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/activities', function(req, res) {
    res.render('activities', { title: 'Hello, activities!' });
});

/* GET aktlist page. */
router.get('/aktlist', function(req, res) {
    var db = req.db;
    var collection = db.get('activities');
    collection.find({},{},function(e,docs){
        res.render('aktlist', {
            "aktlist" : docs
        });
    });
});

module.exports = router;
