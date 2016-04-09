var express = require( 'express' ),
    app = express(),
    mongodb = require( 'mongodb' ).MongoClient,
    bodyParser = require( 'body-parser' ),
    cookieParser = require( 'cookie-parser' ),
    passport = require( 'passport' ),
    session = require( 'express-session' );

var port = process.env.PORT || 5000,
    nav = [
      { link: '/books', text: 'Книги' },
      { link: '/authors', text: 'Авторы' }
    ];

var bookRouter = require( './src/routes/booksRoutes' )( nav ), // передаем данные в роутер в качестве параметра ф-ии
    adminRouter = require( './src/routes/adminRoutes' )( nav ),
    authRouter = require( './src/routes/authRoutes' )( nav );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

app.use( cookieParser() );
app.use( session( { secret: 'qwerty' } ) );
require( './src/config/passport' )( app ); // подтягивает конфиг

app.use( express.static( 'public' ) ); // директория для ресурсов
app.set( 'views', './src/views' ); // директория для шаблонов

app.set( 'view engine', 'ejs' ); // подключаем движок шаблонизатора

app.use( '/books', bookRouter );
app.use( '/admin', adminRouter );
app.use( '/auth', authRouter );

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

// app.get( '/books', function( req, res )
// {
  // res.send( 'Hello books' );
// });

app.listen( port, function( err )
{
  console.log( 'Running server on port', port );
});