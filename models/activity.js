// load the things we need
var mongoose = require('mongoose');

// define the schema for our activities model
var activitySchema = mongoose.Schema({
	_id             : String,
    ersteller_id        : String,
    name                : String,
    kbeschreibung       : String,
    beschreibung        : String,
    datum               : Date,
    uhrzeit             : String,
    dauer               : String,
    teilnehmer          : String,
    bild                : String,
    adresse             : {
        stadt       : String,
        strasse     : String,
        hausnr      : String,
        plz         : String,
    }
});

// create the model for activities and expose it to our app
module.exports = mongoose.model('Activity', activitySchema, "activities");