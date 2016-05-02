 module.exports = function(app) {

 	// var http = require('http');
 	// var util = require('util');

	var multer  = require('multer');

	var upload = multer({ 
		dest: 'public/images/uploads/',

		rename: function (fieldname, filename) {
	        return filename + Date.now();
	    },

	    onFileUploadStart: function (file) {
	        console.log(file.originalname + ' is starting ...')
	    },

	    onFileUploadComplete: function (file) {
	        console.log(file.fieldname + ' uploaded to  ' + file.path)
	        done = true;
	    }
    }).single('avatar');


    app.post('/upload', function(req, res) {

    	// req.body - other form fields

    	// console.log(req.file);

    	// req.file is form files:
    	// { fieldname: 'avatar',
    	//   originalname: 'pink-Kutusita-Nyanko-Bento-Box-2-pcs-Lunch-Box-cat--174026-1.JPG',
    	//   encoding: '7bit',
    	//   mimetype: 'image/jpeg',
    	//   destination: 'public/images/uploads/',
    	//   filename: '3d3a4e1494f4fd01d08f18843cda2913',
    	//   path: 'public/images/uploads/3d3a4e1494f4fd01d08f18843cda2913',
    	//   size: 34236 }

    	upload(req,res,function(err) {
	        if(err) {
	        	req.flash('error', 'Error uploading file.');
	        } else {
	        	req.flash('success', 'The image is successfully uploaded.');
	        }
	        res.redirect("/profile");
	    });

    });

}
