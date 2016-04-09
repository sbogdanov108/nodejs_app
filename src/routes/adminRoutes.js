var express = require( 'express' ),
    mongodb = require( 'mongodb' ).MongoClient;

var adminRouter = express.Router();

var books = [
  {
    title : "Путешествие к Центру Земли",
    genre : "Фантастика",
    author: "Жюль Верн",
    bookId: 32829,
    read  : 0
  },
  {
    title : "Анна Каренина",
    genre : "Художественный роман",
    author: "Лев Николаевич Толстой",
    bookId: 15823480,
    read  : 1
  }
];

var router = function( nav )
{
  // роут для admin/addBooks
  adminRouter.route( '/addBooks' )
    .get( function( req, res )
    {
      var url = 'mongodb://localhost:27017/node_books';

      mongodb.connect( url, function( err, db )
      {
        var collection = db.collection( 'books' );

        collection.insertMany( books, function( err, results )
        {
          res.send( results );
          db.close();
        } );
      });

      // res.send( 'Inserting Books' );
    });

  return adminRouter;
};

module.exports = router;