 module.exports = function(app) {

    // =====================================
    // Activities List =====================
    // =====================================
    
    app.get('/aktlist', function(req, res) {
        // load up the activity model
        var Activity = require('../models/activity');
        // query db for all activities
        Activity.find( function ( err, items, count ){
            res.render( 'aktlist', {
                title : 'Activities',
                aktlist : items
            });
        });
    });

}
