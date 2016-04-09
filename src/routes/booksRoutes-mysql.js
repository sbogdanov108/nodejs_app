var express = require( 'express' );

var bookRouter = express.Router();

var router = function( nav, pool )
{
  // роут для /books
  bookRouter.route( '/' )
    .get( function( req, res )
    {
      pool.query( 'SELECT * FROM books', function( err, rows )
      {
        res.render( 'bookListView', {
          title: 'Books',
          nav  : nav,
          books: rows
        } );
      } );
    } );

  // роут для /books/id
  bookRouter.route( '/:id' )
    // общее для всех методов
    .all( function( req, res, next )
    {
      var id  = req.params.id, // передаваемый параметр через get запрос
          sql = 'SELECT * FROM books WHERE id = ' + pool.escape( id ); // экранируем принимаемый параметр

      pool.query( sql, function( err, rows )
      {
        // если запись в бд не найдена, ответ 404
        if( rows.length === 0 )
          res.status( 404 ).send( 'Такая запись не найдена.' );
        else
        {
          req.book = rows[ 0 ];
          next();
        }
      } );
    })
    .get( function( req, res )
    {
      res.render( 'bookView', {
       title: 'Books',
       nav  : nav,
       book : req.book
       } );
    } );

  return bookRouter;
};

module.exports = router;