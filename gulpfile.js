/*
	This is a learner template , intended to be very easy to use
	Only two simple tasks are done right now
	1) Take .scss file from assets/style.scss can be changed via let stylesSource. Compile it, generate sourcemap and generate a non-minified and minified version and save it in css folder in the root of the project
	2) Take .js files located in .assets/js/vendor and .assets/js/custom and
		i) concat (join) all js files
		ii) minify them (see note for problems with minification)
		iii) save them to /js/ folder in the root of the file
*/

/*
To Do List
	2. Browser Sync
		Currently browser sync is very slow. And not useful for use in development.
		All online blogs says its a good tool but I am not sure right now
*/

let gulp 			= require('gulp');
let sass 			= require('gulp-sass'); // compiles SASS to CSS
let sourcemaps 		= require('gulp-sourcemaps'); // generate css source maps
let notify 		 	= require('gulp-notify'); // provides notification to use once task is complete
let uglify 			= require('gulp-uglify'); // minifies js files
let uglifycss    	= require('gulp-uglifycss'); // minifies css files
let concat       	= require('gulp-concat');  //concatenates multiple js files
let rename       	= require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
let plumber 		= require('gulp-plumber');
let jshint 			= require('gulp-jshint');
let autoprefixer    = require('gulp-autoprefixer');
let lec             = require('gulp-line-ending-corrector') ;

let stylesSource 			 = './assets/css/**/*.scss';
let jsVendorSource 			 = './assets/js/vendor/*.js';
let jsVendorDestination      = './js';
let jsVendorFile 			 = 'vendor';

let jsCustomSource 			 = './assets/js/custom/*.js';
let jsCustomDestination 	 = './js';
let jsCustomFile	 		 = 'main';

/*
	takes style.scss ,
	generates sourcemap
	generates css and put it css folder in route
*/
gulp.task('compileStyles', function(){
	return gulp.src(stylesSource)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer({
				  browsers: ['last 2 versions'],
            	  cascade: false
			}))
			.pipe(sourcemaps.write('./maps'))
      .pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
			.pipe(gulp.dest('./css'))
			.pipe(uglifycss({
      				"maxLineLen": 80,
      				"uglyComments": true
    		}))
    	.pipe( rename( { suffix: '.min' } ) )
      .pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
      .pipe(gulp.dest('./css'))
			.pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) );
});

/*Compile Files in js/vendor intended for vendor scripts example bootstrap, meanmenu, etc*/
gulp.task('compileVendorJS', function(){
	return gulp.src(jsVendorSource)
		   .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
		   .pipe( jshint() )
		   .pipe(jshint.reporter('jshint-stylish'))
		   .pipe( concat( jsVendorFile + '.js' )  )
		   .pipe( gulp.dest( jsVendorDestination ) )
		   .pipe( rename( {
       			basename: jsVendorFile,
       			suffix: '.min'
    	 	}))
		   .pipe( uglify() )
		   .pipe( gulp.dest( jsVendorDestination ) )
		   .pipe( notify( { message: 'TASK: "compileVendorJS" Completed! 💯', onLast: true } ) );
});


/*Compile Files in Custom JS intended for non-vendor scripts*/
gulp.task('compileCustomJS', function(){
	return gulp.src(jsCustomSource)
		   .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
		   .pipe( jshint() )
		   .pipe(jshint.reporter('jshint-stylish'))
		   .pipe( concat( jsCustomFile  + '.js' )  )
		   .pipe( gulp.dest( jsCustomDestination ) )
		   .pipe( rename( {
       			basename: jsCustomFile,
       			suffix: '.min'
    	 	}))
		   .pipe( uglify() )
		   .pipe( gulp.dest( jsCustomDestination ) )
		   .pipe( notify( { message: 'TASK: "compileCustomJS" Completed! 💯', onLast: true } ) );
});


/*Default tasks that will be run when using "gulp" command*/
gulp.task('default', gulp.series('compileStyles', 'compileVendorJS', 'compileCustomJS', (done) => {
	gulp.watch( stylesSource, gulp.series('compileStyles') );
	gulp.watch( jsVendorSource, gulp.series('compileVendorJS') );
	gulp.watch( jsCustomSource, gulp.series('compileCustomJS') );
	done();
}));
