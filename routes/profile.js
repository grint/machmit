 module.exports = function(app) {

	/* POST to update profile */
    app.post('/updateprofile', function(req, res) {

        // load up the activity model
        var User = require('../models/user');

        // get current user
        // var user = new User({ _id: req.user._id });

        // Submit to DB
        User.findById(req.user._id, function (err, user) {
            if (err) return handleError(err);

            // Get form values. 
            user.name = req.body.name;
            user.city = req.body.city;
            user.address = req.body.address;

            user.save(function (err) {
                if (err) return handleError(err);
                res.redirect("profile");
            });
        });
    });

}
