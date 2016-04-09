var express = require( 'express' ),
    mongodb = require( 'mongodb' ).MongoClient;

var bookRouter = express.Router();

var router = function( nav )
{
  var bookService = require( '../services/goodreadService' )(), 
      bookController = require( '../controllers/bookController' )( bookService, nav );
  
  bookRouter.use( bookController.middleware );

  // роут для /books
  bookRouter.route( '/' )
    .get( bookController.getIndex );

  // роут для /books/id
  bookRouter.route( '/:id' )
    .get( bookController.getById );

  return bookRouter;
};

module.exports = router;