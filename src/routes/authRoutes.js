/**
 * Created by sb on 07.04.2016.
 */

var express = require( 'express' ),
    mongodb = require( 'mongodb' ).MongoClient,
    passport = require( 'passport' );

var authRouter = express.Router();

var router = function()
{
  // роут для auth/signUp
  authRouter.route( '/signUp' )
    .post( function( req, res )
    {
      var url = 'mongodb://localhost:27017/node_books';
      
      mongodb.connect( url, function( err, db )
      {
        var collection = db.collection( 'users' ),
            user = {
              username: req.body.userName,
              password: req.body.password
            };

        // добавление в бд нового юзера
        collection.insertOne( user, function( err, results )
        {
          // после добавления
          req.login( results.ops[ 0 ], function()
          {
            res.redirect( '/auth/profile' ); // при успешном логине
          } );
        } );
      });
    });

  // роут для auth/signIn
  authRouter.route( '/signIn' )
    // используем локальную стратегию
    .post( passport.authenticate( 'local', {
      failureRedirect: '/'
    } ), function( req, res )
    {
      res.redirect( '/auth/profile' ); // при успешном логине
    } );

  authRouter.route( '/profile' )
    .all( function( req, res, next )
    {
      // если нет объекта user, т.е юзер не залогинен; иначе переходим к следующему методу
      if( ! req.user )
        res.redirect( '/' );

      next();
    })
    .get( function( req, res )
    {
      res.json( req.user );
    });

  return authRouter;
};

module.exports = router;