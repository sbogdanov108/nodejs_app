var express = require( 'express' ),
    mysql = require( 'mysql' );

var app = express(),
    configDB = {
      connectionLimit: 10,
      host    : 'localhost',
      user    : 'root',
      password: '',
      database: 'node_books'
    };

var pool = mysql.createPool( configDB );

var port = process.env.PORT || 5000,
    nav = [
      { link: '/books', text: 'Книги' },
      { link: '/authors', text: 'Авторы' }
    ],
    bookRouter = require( './src/routes/booksRoutes-mysql' )( nav,pool ); // передаем данные в роутер в качестве параметра ф-ии

app.use( express.static( 'public' ) ); // директория для ресурсов
app.set( 'views', './src/views' ); // директория для шаблонов

app.set( 'view engine', 'ejs' ); // подключаем движок шаблонизатора

app.use( '/books', bookRouter );

app.get( '/', function( req, res )
{
  res.render( 'index', {
    title: 'Hello from render',
    nav: [
      { link: '/books', text: 'Книги' },
      { link: '/authors', text: 'Авторы' }
    ] // передача данных в шаблон
  } );
});

app.get( '/books', function( req, res )
{
  res.send( 'Hello books' );
});

app.listen( port, function( err )
{
  console.log( 'Running server on port', port );
});