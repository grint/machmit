 module.exports = function(app) {

	var multer  = require('multer');
	var fs  = require('fs');

	var userPhotosPath = 'public/images/uploads/profile/';

	var userPhotosStorage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, userPhotosPath);
		},
		filename: function (req, file, cb) {
			var originalname = file.originalname;
			var extension = originalname.split(".");
			var username = req.user.name.replace(" ", "_").toLowerCase();
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


    app.post('/uploadAvatar', function(req, res) {

    	// load up the user model
        var User = require('../models/user');
     
    	uploadUserPhotos(req,res,function(err) {
	        if(err) {
	        	req.flash('error', 'Error uploading file.');
        	} else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }

	        // console.log(req.file);

	        // Submit to DB
	        User.findById(req.user._id, function (err, user) {
	            if (err) return handleError(err);

	            // remove old avatar
	            fs.unlink("./" + userPhotosPath + req.user.avatar, function(err){
					if (err) throw err;
				});

	            // write new avatar to DB
	            user.avatar = req.file.filename;

	            user.save(function (err) {
	                if (err) return handleError(err);
	                res.redirect("profile");
	            });
	        });
	    });
    });
    
    
    
    
    var activitiesPhotosPath = 'public/images/activities/';

	var activitiesPhotosStorage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, activitiesPhotosPath);
		},
		filename: function (req, file, cb) {
			var originalname = file.originalname;
			var extension = originalname.split(".");
            console.log(req.akt);
			var activityname = req.akt.name.replace(" ", "_").toLowerCase();
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


    app.post('/uploadBild', function(req, res) {

    	// load up the user model
        var Akt = require('../models/activity');
     
    	uploadActivitiesPhotos(req,res,function(err) {
	        if(err) {
	        	req.flash('error', 'Error uploading file.');
        	} else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }

	        // console.log(req.file);

	        // Submit to DB
	        Akt.findById(req.akt._id, function (err, akt) {
	            if (err) return handleError(err);

	            // remove old avatar
	            fs.unlink("./" + activitiesPhotosPath + req.akt.avatar, function(err){
					if (err) throw err;
				});

	            // write new avatar to DB
	            akt.avatar = req.file.filename;

	            akt.save(function (err) {
	                if (err) return handleError(err);
	                res.redirect("edit");
	            });
	        });
	    });
    });

}
