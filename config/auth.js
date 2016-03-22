 
// expose our config directly to our application using module.exports
module.exports = {
    // https://developers.facebook.com/apps/223518244667775/
    'facebookAuth' : {
        'clientID'      : '223518244667775',
        'clientSecret'  : 'fd107aa5d2f00c2c7999172f06976a4a',
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    // https://apps.twitter.com/app/12122247
    'twitterAuth' : {
        'consumerKey'       : 'NLh6oMfmnlFPYxjwXCiffhbaI',
        'consumerSecret'    : 'Ixmlj6uOY2zIwneA4c5Qc8wozlSSTdd6TOZheQS7xYKkmEl9HZ',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    // https://console.developers.google.com/apis/credentials?project=dhbw-machmit
    'googleAuth' : {
        'clientID'      : '733460020764-ee0j3hu9qq6bs8c7qa3lq50r4322ka81.apps.googleusercontent.com',
        'clientSecret'  : 'eP7LVjE01Bv8Dp_6zcA3r97-',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};