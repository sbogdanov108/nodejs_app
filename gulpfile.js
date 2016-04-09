/**
 * Created by sb on 06.04.2016.
 */

var gulp = require( 'gulp' ),
    nodemon = require( 'gulp-nodemon' ); // перезапуск ноды

var jsFiles = [ '*.js', 'src/**/*.js' ];

gulp.task( 'inject', function()
{
  var wiredep = require( 'wiredep' ).stream, // вставка ресурсов из бовера
      inject = require( 'gulp-inject' ); // вставка ресурсов из проекта (styles.css; app.js and etc.)

  // директории, в которых находятся ресурсы проекта
  var injectSrc = gulp.src( [
    './public/css/*.css',
    './public/js/*.js'
  ], { read: false } );

  var injectOptions = {
    ignorePath: '/public' // если нужно избавиться от этого пути
  };

  var options = {
      bowerJson: require( './bower.json' ),
      directory: './public/lib', // директория, куда bower загружает библиотеки
      ignorePath: '../../public' // если нужно избавиться от этого пути, который добавляется к вставке
    };

  return gulp.src( './src/views/*.ejs' )
    .pipe( wiredep( options ))
    .pipe( inject( injectSrc, injectOptions ) )
    .pipe( gulp.dest( './src/views' ) );
});

gulp.task( 'serve', [ 'inject' ], function()
{
  var options = {
    script: 'app.js', // стартовый скрипт сервера
    delay: 1,
    env: {
      'PORT': 3000
    },
    watch: jsFiles // рестарт при изменении этих файлов
  };

  return nodemon( options )
    .on( 'restart', function( ev )
    {
      console.log( 'Restarting...' );
    } );
});