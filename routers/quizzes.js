var path    = require('path'),
    express = require('express'),
    router  = express.Router();

router.get( "/quizzes", function( req, res ){
    res.sendFile( path.normalize( __dirname + '/../quizzes.json' ), function( err ){
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});

module.exports = router;