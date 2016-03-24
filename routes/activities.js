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
	
	/* GET New Aktivitaet page. */
    app.get('/newaktiviti', function(req, res) {
    res.render('newaktiviti', { title: 'Add New Aktivitaet' });
});

	/* POST to Add User Service */
    app.post('/addakti', function(req, res) {

    // Set our internal DB variable
    var Activity = require('../models/activity');
	var newAkt = new Activity();

    // Get our form values. These rely on the "name" attributes
     newAkt.name = req.body.Name;
	 newAkt.beschreibung = req.body.beschreibung;
	 newAkt.datum = req.body.datum;
	 newAkt.uhrzeit = req.body.uhrzeit;
	 newAkt.dauer = req.body.dauer;
	 newAkt.teilnehmer = req.body.teilnehmer;
	 newAkt.adresse.stadt = req.body.stadt;
	 newAkt.adresse.strasse = req.body.strasse;
	 newAkt.adresse.hausnr = req.body.hausnr;
	 newAkt.adresse.plz = req.body.plz; 

    // Submit to the DB
    newAkt.save(        
    function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("aktlist");
        }
    });
});

}
