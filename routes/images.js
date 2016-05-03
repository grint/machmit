 module.exports = function(app) {

	var multer  = require('multer');
	var fs  = require('fs');

	var userPhotosPath = 'public/images/uploads/profile/';

	var storage = multer.diskStorage({
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

	var upload = multer({
		storage: storage,
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


    app.post('/upload', function(req, res) {

    	// req.body - other form fields
    	// req.file is form files:
    	// { fieldname: 'avatar',
    	//   originalname:,
    	//   encoding: '7bit',
    	//   mimetype: 'image/jpeg',
    	//   destination: 'public/images/uploads/profile',
    	//   filename:,
    	//   path: 'public/images/uploads/profile/....jpg',
    	//   size: 34236 }

    	// load up the user model
        var User = require('../models/user');
     
    	upload(req,res,function(err) {
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

}
