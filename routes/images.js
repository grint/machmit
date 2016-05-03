 module.exports = function(app) {

	var multer  = require('multer');

	 var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, 'public/images/uploads/profile/');
	  },
	  filename: function (req, file, cb) {
	    var originalname = file.originalname;
	    var extension = originalname.split(".");
	    var username = req.user.name.replace(" ", "").toLowerCase();
	    filename = username + "_" + Date.now() + '.' + extension[extension.length-1];
	    cb(null, filename);
	  },
		onFileUploadComplete: function (file) {
			// var fileimage = file.name;
			console.log("Upload complete");
		}
	});

	var upload = multer({
		storage: storage,
		limits: {
			fieldNameSize: 100,
			files: 1,
			fileSize: 1000000 // 1 mb
		},
		fileFilter: function (req, file, cb) {
			if (file.mimetype !== 'image/png'
            && file.mimetype !== 'image/jpg'
            && file.mimetype !== 'image/jpeg'
            && file.mimetype !== 'image/gif') {
            	console.log('Got file of type', file.mimetype);
				req.fileValidationError = 'goes wrong on the mimetype';
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
	        } else if(req.fileValidationError) {
             	req.flash('error', req.fileValidationError);
        	} else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }

	        // console.log(req.file);

	        var filename = req.file.filename;

	        // Submit to DB
	        User.findById(req.user._id, function (err, user) {
	            if (err) return handleError(err);

	            user.avatar = filename;
	            
	            user.save(function (err) {
	                if (err) return handleError(err);
	                res.redirect("profile");
	            });
	        });

	        // res.redirect("/profile");
	    });

    });

}
