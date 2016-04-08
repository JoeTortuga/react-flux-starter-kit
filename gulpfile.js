"use strict";

let gulp = require('gulp')
let browserify = require('browserify')
let source = require('vinyl-source-stream')
let gutil = require('gulp-util')
let reactify = require('reactify')
let babelify = require('babelify')


var concat = require('gulp-concat'); //Concatenates files
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var lint = require('gulp-eslint'); //Lint JS files, including JSX

//external dependencies we won't bundle in dev mode
let dependencies = [
	'react',
	'react/addons',
	'jquery',
	'backbone'
]

let scriptsCount = 0

//Gulp Tasks
//------------------------------------------
gulp.task('scripts', function() {
	bundleApp(false)
})

gulp.task('deploy', function() {
	bundleApp(true)
})

gulp.task('watch', function() {
	// gulp.watch(config.paths.html, ['html']);
	gulp.watch(['./src/**/*.js'], ['scripts']);
});

gulp.task('default', ['scripts','watch']);

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
	scriptsCount++;
	// Browserify will bundle all our js files together in to one and will let
	// us use modules in the front end.
	var appBundler = browserify('./src/**/*.js',{
    	debug: true
  	})

	// If it's not for production, a separate vendors.js file will be created
	// the first time gulp is run so that we don't have to rebundle things like
	// react everytime there's a change in the js file
  	if (!isProduction && scriptsCount === 1){
  		// create vendors.js for dev environment.
		console.log("Building vendors.js....", dependencies)
  		browserify({
			require: dependencies,
			debug: true
		})
			.bundle()
			.on('error', gutil.log)
			.pipe(source('vendors.js'))
			.pipe(gulp.dest('./web/js/'));
  	}
  	if (!isProduction){
  		// make the dependencies external so they dont get bundled by the
		// app bundler. Dependencies are already bundled in vendor.js for
		// development environments.
  		dependencies.forEach(function(dep){
  			appBundler.external(dep);
  		})
  	}


  		// transform ES6 and JSX to ES5 with babelify
	  	appBundler.transform("babelify", {presets: ["es2015", "react"]})
	    .bundle()
	    .on('error',gutil.log)
	    .pipe(source('bundle.js'))
	    .pipe(gulp.dest('./web/js/'));
}
// var config = {
// 	port: 9005,
// 	devBaseUrl: 'http://localhost',
// 	paths: {
// 		html: './src/*.html',
// 		js: './src/**/*.js',
// 		css: [
//       		'node_modules/bootstrap/dist/css/bootstrap.min.css',
//       		'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
//     	],
// 		dist: './dist',
// 		mainJs: './src/main.js'
// 	}
// }
//
// //Start a local development server
// gulp.task('connect', function() {
// 	connect.server({
// 		root: ['dist'],
// 		port: config.port,
// 		base: config.devBaseUrl,
// 		livereload: true
// 	});
// });
//
// gulp.task('open', ['connect'], function() {
// 	gulp.src('dist/index.html')
// 		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
// });
//
// gulp.task('html', function() {
// 	gulp.src(config.paths.html)
// 		.pipe(gulp.dest(config.paths.dist))
// 		.pipe(connect.reload());
// });
//
// gulp.task('js', function() {
// 	browserify(config.paths.mainJs)
// 		.transform([babelify,reactify])
// 		.bundle()
// 		.on('error', console.error.bind(console))
// 		.pipe(source('bundle.js'))
// 		.pipe(gulp.dest(config.paths.dist + '/scripts'))
// 		.pipe(connect.reload());
// });
//
// gulp.task('css', function() {
// 	gulp.src(config.paths.css)
// 		.pipe(concat('bundle.css'))
// 		.pipe(gulp.dest(config.paths.dist + '/css'));
// });
//
// gulp.task('lint', function() {
// 	return gulp.src(config.paths.js)
// 		.pipe(lint({config: 'eslint.config.json'}))
// 		.pipe(lint.format());
// });
//
// gulp.task('watch', function() {
// 	gulp.watch(config.paths.html, ['html']);
// 	gulp.watch(config.paths.js, ['js', 'lint']);
// });
//
// gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
