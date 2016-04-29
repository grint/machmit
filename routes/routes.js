 module.exports = function(app, passport) {

    var moment = require('moment');

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index', { 
            title: 'Express', 
            menu: 'home',
            message: req.flash('loginMessage'),
            isAuthenticated: req.isAuthenticated(),
            currentUser: req.session.passport.user
        });
    });


    // =====================================
    // Activities List =====================
    // =====================================
	    app.get('/aktlist', function(req, res) {
        // load up the activity model
        var Activity = require('../models/activity');
        var currentUser = req.session.passport.user;
        var today = moment(Date.now()).format('YYYY-MM-DD');;

        // query db for all activities
        Activity.find( function ( err, items, count ) {

            // check if the current user attends an event
            for (var i= 0; i < items.length; i++) {
                for (var j= 0; j < items[i]._idTeilnehmer.length; j++) {
                    if(items[i]._idTeilnehmer[j] == currentUser) {
                        items[i].isAttendee = true;
                    }
                }

                var activityDate = moment(items[i].datum).format("YYYY-MM-DD");

                if (moment(today).isAfter(activityDate)) {
                    items[i].status = 'past';
                }
                else if (moment(today).isBefore(activityDate)) {
                    items[i].status = 'future';
                }
                else {
                    items[i].status = 'today';
                }
            }

            

            res.render( 'aktlist', {
                title : 'Aktivitäten',
                menu: 'aktlist',
                message: req.flash('loginMessage'),
                aktlist : items,
                isAuthenticated: req.isAuthenticated(),
                currentUser: currentUser,
            })
        })
    });
	
    require('./activities')(app);


    /* GET One Activity page. */
    app.get('/activity/:id', function(req, res) {        
        var Activity = require('../models/activity');
        var currentUser = req.session.passport.user;
        
        Activity.findById(req.params.id).populate('_idErsteller').populate('_idTeilnehmer')
            .exec(function (err, activity) {             
                if (err) return handleError(err);

                // check if the current user attends the event
                for (var i = 0; i < activity._idTeilnehmer.length; i++) {
                    if(activity._idTeilnehmer[i]._id == currentUser) {
                        activity.isAttendee = true;
                    }
                }

                res.render( 'activity', {
                    title : activity.name,
                    menu: 'aktlist',
                    message: req.flash('loginMessage'),
                    isAuthenticated: req.isAuthenticated(),
                    currentUser: currentUser,
                    akt : activity
                }); 
            });                
    });



	/* GET New Aktivitaet page. */
    app.get('/newaktivity',isLoggedIn, function(req, res) {
        res.render('newaktivity', { 
            title: 'Neue Aktivität erstellen',
            menu: 'newaktivity',
			message: req.flash('loginMessage')
        });
    });
	
	
	/* POST to Add User Service */
    app.post('/addaktivity',isLoggedIn, function(req, res) {
		
		var mongoose = require('mongoose');

        // load up the activity model
        var Activity = require('../models/activity');
		var user = req.user;

        // create a new activity object
    	var newAkt = new Activity();		

        // Get our form values. These rely on the "name" attributes
		 newAkt._id = mongoose.Types.ObjectId();
		 newAkt._idErsteller = user._id;		 
         newAkt.name = req.body.name;
    	 newAkt.beschreibung = req.body.beschreibung;
		 newAkt.kbeschreibung = req.body.kurzbeschreibung;
    	 newAkt.datum = req.body.datum;
    	 newAkt.uhrzeit = req.body.uhrzeit;
    	 newAkt.dauer = req.body.dauer;
    	 newAkt.teilnehmer = req.body.teilnehmer;
    	 newAkt.adresse.stadt = req.body.stadt;
    	 newAkt.adresse.strasse = req.body.strasse;
    	 newAkt.adresse.hausnr = req.body.hausnr;
    	 newAkt.adresse.plz = req.body.plz; 

        // Submit to the DB
        newAkt.save(function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database: " + err);
            }
            else {
                // And forward to success page
                res.redirect("aktlist");
            }
        });
    });		
	
	 app.get('/machmit-:id', isLoggedIn, function(req, res) {		
		var Activity = require('../models/activity');
	    var user = req.user;           		 
	    Activity.findById(req.params.id, function (err, activity) {            	
            if (err) {
				console.log(err);
				return handleError(err);
			}
				
			//Id vom Teilnehmer wird für Aktivität in der Datenbank gespeichert
			activity._idTeilnehmer = user._id;
			activity.save(function (err) {
                if (err) {
					console.log(err);
					return handleError(err);
				}
                res.redirect("/aktlist");
            });
        });	
	});	
	
	app.get('/edit/:id',isLoggedIn, function(req, res) {		
		var Activity = require('../models/activity');
	    var user = req.user;           		 
	    Activity.findById(req.params.id, function (err, activity) {            	
            if (err) return handleError(err);
			//Es wird geprüft, dass die Aktivität nur von ihrem Besitzer bearbeitet wird
			var erstellerId = activity._idErsteller.toString();			
			var userId = user._id.toString();				
			if(erstellerId === userId){
    			res.render( 'edit', {
                    title : 'Edit Aktivität',
                    menu: 'editaktivity',
					message: req.flash('loginMessage'),
                    akt : activity
                });		 
			}
            else
              res.send(500,'Du kannst diese Aktivität nicht bearbeiten, weil sie nicht dir gehört') ;				
        }); 	  		   
    });	
	
	
	app.post('/update/:id', isLoggedIn,function(req, res) {
        // load up the activity model
        var Activity = require('../models/activity');
		// Submit to DB
        Activity.findById(req.params.id, function (err, activity) {
            if (err) return handleError(err);		
            // Get form values. 
			activity.name = req.body.name;
            activity.beschreibung = req.body.beschreibung;
            activity.kbeschreibung = req.body.kurzbeschreibung;
			activity.datum = req.body.datum;			
		    activity.uhrzeit = req.body.uhrzeit;
			activity.dauer = req.body.dauer;
			activity.teilnehmer = req.body.teilnehmer;
			activity.adresse.stadt = req.body.stadt;
			activity.adresse.strasse = req.body.strasse;
			activity.adresse.hausnr = req.body.hausnr;
			activity.adresse.plz = req.body.plz;

            activity.save(function (err) {
                if (err) return handleError(err);
                res.redirect("/aktlist");
            });
        });
    });	
    

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user, // get the user out of session and pass to template,
			message: req.flash('loginMessage'),
            isAuthenticated: req.isAuthenticated(),
            menu: 'profile',
        });
    });


    // =====================================
    // Profile Form =====================
    // =====================================
    require('./profile')(app);


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    // app.get('/login', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render('login', { 
    //         message: req.flash('loginMessage'),
    //         menu: 'login'
    //     }); 
    // });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : 'back', // redirect back to the previous page
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    // app.get('/signup', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup', { 
    //         message: req.flash('signupMessage'),
    //         menu: 'signup'
    //     });
    // });

     // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', 
    	passport.authenticate('facebook', {
	        successRedirect : '/profile',
	        failureRedirect : '/login'
	    }),

	    // on error; likely to be something FacebookTokenError token invalid or already used token,
	    // these errors occur when the user logs in twice with the same token
	    function(err,req,res,next) {
	        if(err) {
	            res.status(400);
	            res.send(err.message);
	        }
	    }

    );


    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));



    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));



    // =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));



    // =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });



};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
