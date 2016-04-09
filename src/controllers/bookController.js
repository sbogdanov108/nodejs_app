var mongodb  = require( 'mongodb' ).MongoClient,
    objectId = require( 'mongodb' ).ObjectID;

var bookController = function( bookService, nav )
{
  var middleware = function( req, res, next )
  {
    // если нет объекта user, т.е юзер не залогинен; иначе переходим к следующему методу
    if( !req.user )
      res.redirect( '/' );

    next(); 
  };

  var getIndex = function( req, res )
  {
    var url = 'mongodb://localhost:27017/node_books';

    mongodb.connect( url, function( err, db )
    {
      var collection = db.collection( 'books' );

      // получить все записи из бд
      collection.find().toArray( function( err, results )
      {
        res.render( 'bookListView', {
          title: 'Books',
          nav  : nav,
          books: results
        } );
      } );
    } );
  };

  var getById = function( req, res )
  {
    var url = 'mongodb://localhost:27017/node_books',
        id  = new objectId( req.params.id );

    mongodb.connect( url, function( err, db )
    {
      var collection = db.collection( 'books' );

      // получить одну запись из бд
      // в документации нет инфы, что этот метод deprecated; mongo ver. 3.2
      // https://docs.mongodb.org/manual/reference/method/db.collection.findOne/#db.collection.findOne
      collection.findOne( { _id: id }, function( err, results )
      {
        // если есть в бд ид книги от goodreads
        if( results.bookId )
        {
          bookService.getBookById( results.bookId, function( err, book )
          {
            results.book = book;

            res.render( 'bookView', {
              title: 'Books',
              nav  : nav,
              book : results
            } );
          } );
        }
        else {
          res.render( 'bookView', {
            title: 'Books',
            nav  : nav,
            book : results
          } );
        }
      } );
    } );
  };

  return {
    getIndex: getIndex,
    getById: getById,
    middleware: middleware
  }
};

module.exports = bookController;