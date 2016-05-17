 module.exports = function(app) {

	var multer  = require('multer');
	var fs  = require('fs');

	
    // =====================================
    // AVATAR UPLOAD =======================
    // =====================================
	var userPhotosPath = 'public/images/uploads/profile/';

	var userPhotosStorage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, userPhotosPath);
		},
		filename: function (req, file, cb) {
			var originalname = file.originalname;
			var extension = originalname.split(".");
			
			var username = '';
			if(req.user.local.username) {
				var username = req.user.local.username.replace(" ", "_").toLowerCase();
			}
			else if(req.user.name) {
				var username = req.user.name.replace(" ", "_").toLowerCase();
			}
			
			filename = username + "_" + Date.now() + '.' + extension[extension.length-1];
			cb(null, filename);
		}
	});

	var uploadUserPhotos = multer({
		storage: userPhotosStorage,
		limits: {
			files: 1,
			fileSize: 1000000 // 1mb
		},
		fileFilter: function (req, file, cb) {
			if (file.mimetype !== 'image/png'
			&& file.mimetype !== 'image/jpg'
			&& file.mimetype !== 'image/jpeg'
			&& file.mimetype !== 'image/gif') {
				// console.log('Got file of type', file.mimetype);
				req.flash('error', 'Only image files are allowed!');
				return cb(null, false, new Error('Only image files are allowed!'));
			}
			cb(null, true);
		}
	}).single('avatar'); // avatar - name of the file field in the form


    // Post user avatar upload
    app.post('/uploadAvatar', function(req, res) {

    	// load up the user model
        var User = require('../models/user');
     
    	uploadUserPhotos(req,res,function(err) {
	        if(err) {
	        	req.flash('error', 'Error uploading file.');
	        	console.log('Error uploading file: ' + err);
        	} else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }

	        // console.log(req.file);

	        // Submit to DB
	        User.findById(req.user._id, function (err, user) {
	            if (err) console.log(err);
	            
				// remove old image
	            if(req.user.avatar) {
		            var oldBild = "./" + userPhotosPath + req.user.avatar;
		            fs.stat(oldBild, function(err, stat) {
						if(err == null) {
							// File exists
							fs.unlink(oldAvatar, function(err){
								if (err) throw err;
							});
						} else if(err.code == 'ENOENT') {
							// file does not exist
						} else {
							console.log('Some other error: ', err.code);
						}
					});
	            }

	            // write new avatar to DB
	            if(req.file) {
	            	user.avatar = req.file.filename;
	            }

	            user.save(function (err) {
	                if (err) console.log(err);
	                res.redirect("profile");
	            });
	        });
	    });
    });

   




    // =====================================
    // ACTIVITY IMAGE UPLOAD ===============
    // =====================================

    var activitiesPhotosPath = 'public/images/activities/';

	var activitiesPhotosStorage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, activitiesPhotosPath);
		},
		filename: function (req, file, cb) {
			var originalname = file.originalname;
			var extension = originalname.split(".");
			var activityname = req.body.name;
			filename = activityname + "_" + Date.now() + '.' + extension[extension.length-1];
			cb(null, filename);
		}
	});

	var uploadActivitiesPhotos = multer({
		storage: activitiesPhotosStorage,
		limits: {
			files: 1,
			fileSize: 1000000 // 1mb
		},
		fileFilter: function (req, file, cb) {
			if (file.mimetype !== 'image/png'
			&& file.mimetype !== 'image/jpg'
			&& file.mimetype !== 'image/jpeg'
			&& file.mimetype !== 'image/gif') {
				// console.log('Got file of type', file.mimetype);
				req.flash('error', 'Only image files are allowed!');
				return cb(null, false, new Error('Only image files are allowed!'));
			}
			cb(null, true);
		}
	}).single('bild'); // avatar - name of the file field in the form
    

    // Post activity image upload
    app.post('/uploadBild', function(req, res) {
    
    	// load up the user model
        var Akt = require('../models/activity');
     
    	uploadActivitiesPhotos(req,res,function(err) {
	        if(err) {
	        	req.flash('error', 'Error uploading file.');
        	} else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }

	        // Submit to DB
	        Akt.findById(req.body.aktid, function (err, akt) {
	            if (err) return console.log(err);

	            // remove old image
	            if(req.body.oldbild) {
		            var oldBild = "./" + activitiesPhotosPath + req.body.oldbild;
		            fs.stat(oldBild, function(err, stat) {
						if(err == null) {
							// File exists
							fs.unlink(oldAvatar, function(err){
								if (err) throw err;
							});
						} else if(err.code == 'ENOENT') {
							// file does not exist
						} else {
							console.log('Some other error: ', err.code);
						}
					});
	            }

	            // write new avatar to DB
	            akt.bild = req.file.filename;

	            akt.save(function (err) {
	                if (err) return console.log(err);
	                res.redirect("edit/"+req.body.aktid);
	            });
	        });
	    });
    });

}
