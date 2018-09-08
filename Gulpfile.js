var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var babel= require('gulp-babel')
var imagemin = require('gulp-imagemin')
var jpgtran = require('imagemin-jpegtran')
var rename = require('gulp-rename')
var uglifyEs = require('gulp-uglify-es').default;
var browserify = require('gulp-browserify')


gulp.task('default',['scripts-dist','scripts-dist-rest-info'], function() {

	console.log('Success!');
})
gulp.task('scripts-dist',function(){
	gulp.src(['js/dbhelper.js','js/main.js'])
		.pipe(concat('mainpage.min.js'))
		.pipe(uglifyEs())
		.pipe(gulp.dest('dist/js'))
})

gulp.task('scripts-dist-rest-info',function(){
	gulp.src(['js/dbhelper.js','js/restaurant_info.js'])
		.pipe(concat('rest-page.min.js'))
		.pipe(uglifyEs())
		.pipe(gulp.dest('dist/js'))
})
gulp.task('crunch-images', function() {
	return gulp.src('images/**/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
})
gulp.task('rename',function(){
	gulp.src('images/**/*.jpg')
	.pipe(rename(function(path){
		path.extname = ".webp";
	}))
	.pipe(gulp.dest('dist/webp'))
})
gulp.task('transfer',function(){
	gulp.src('js/idb.js')
	.pipe(babel({
		presets:["es2015"]
	}))
	.pipe(browserify())
	.pipe(gulp.dest('dist/js'))
})
gulp.task('transfer-rest',function(){
	gulp.src('js/idb-restaurant.js')
	.pipe(babel({
		presets:["es2015"]
	}))
	.pipe(browserify())
	.pipe(gulp.dest('dist/js'))
})