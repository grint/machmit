// load the things we need
var mongoose = require('mongoose');
//require('./user.js');
var user = require('./user'); //see ref

// define the schema for our activities model
var activitySchema = mongoose.Schema({
	_id                 : mongoose.Schema.Types.ObjectId,
    _idErsteller        : { type: mongoose.Schema.Types.ObjectId, ref: 'user._id' },
	_idTeilnehmer       : [{ type: mongoose.Schema.Types.ObjectId, ref: 'user._id' }],
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