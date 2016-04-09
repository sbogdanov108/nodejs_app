var passport = require( 'passport' ),
    LocalStrategy = require( 'passport-local' ).Strategy,
    mongodb = require( 'mongodb' ).MongoClient;

module.exports = function()
{
  // name в инпутах формы
  passport.use( new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  },
  function( username, password, done )
  {
    var url = 'mongodb://localhost:27017/node_books';

    mongodb.connect( url, function( err, db )
    {
      var collection = db.collection( 'users' );

      collection.find({ username: username }).limit( 1 ).next( function( err, results )
      {
        // если найден юзер с таким именем и введенный пароль совпадает с паролем из бд
        if( results && results.password === password )
        {
          var user = results;
          done( null, user );
        }
        else
        {
          done( null, false, {
            message: 'Неправильный логин и/или пароль.'
          } );
        }
      } );
    });
  }));
};