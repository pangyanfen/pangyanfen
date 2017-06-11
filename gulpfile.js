var gulp = require("gulp")
var uglify = require("gulp-uglify")//js的压缩
var minify = require("gulp-minify-css")//css的压缩
var htmlmin = require("gulp-htmlmin")//html的压缩
var concat = require("gulp-concat")//合并文件
var imagemin = require('gulp-imagemin');//压缩图片
var sass = require('gulp-sass');//sass编译
var rename = require('gulp-rename');//文件重命名
var browserify = require('gulp-browserify');//模块化的打包
var webserver = require('gulp-webserver');//web服务热启动
var url=require("url")
var data=require("./data/data.js")
var rev = require('gulp-rev');   //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
//压缩js文件
gulp.task("jsmin",function(){
	gulp.src("src/js/*.js")
		//模块化打包
		.pipe(browserify({
			insertGlobals : true,
			debug : !gulp.env.production
		}))
		.pipe(uglify())//压缩js文件
		.pipe(rev())
    	.pipe(gulp.dest("bound/js/"))
		.pipe(revCollector())
		.pipe(rev.manifest())
		.pipe(gulp.dest("./rev/js"));
})
gulp.task('replaceRev', ["jsmin"], function() {
	setTimeout(function() {

		gulp.src(['./rev/**/*.json', './src/html/*.html'])
			.pipe(revCollector({
				replaceReved: true,
				dirReplacements: {
					'css': 'css/',
					'js': 'js/',
				}
			}))
			.pipe(gulp.dest('./bound/html'));
	}, 2000)
});
//压缩css
gulp.task("cssmin",function(){
	gulp.src("src/css/*.css")
	.pipe(minify())
	.pipe(gulp.dest("bound/css/"))
})
//压缩html
gulp.task("htmlmin",function(){
	gulp.src("src/html/*.html")
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest("bound/html/"))
})
//压缩图片
gulp.task("imagesmin",function(){
	gulp.src("src/images/*.jpg")
	.pipe(imagemin())
	.pipe(gulp.dest("bound/images/"))
})
//压缩scss
gulp.task("sass",function(){
	return gulp.src("src/css/*.scss")
	.pipe(sass().on('error',sass.logError))
	.pipe(gulp.dest("bound/css/"))
})
////压缩sass
gulp.task("sassmin",function(){
	gulp.src("src/css/*.sass")
		.pipe(sass())
		.pipe(minify())
		.pipe(gulp.dest("bound/css/"))
})
//web服务热启动
gulp.task("server",["jsmin","cssmin","htmlmin"],function(){
	gulp.watch("./src/html/*.html",["htmlmin"])   //监听文件实现实时更新
	gulp.watch("./src/css/*.sass",["sassmin"])
	gulp.watch("src/js/*.js",["jsmin"])
	gulp.src("./bound")//读取bound中的文件
		.pipe(webserver({//web服务热启动
			port:8001,    //改端口号
		    livereload: true,//自动刷新
		    directoryListing: true,//文件夹的浏览
			//req 请求头
			//res 响应的数据
			//res请求头是模拟的后台数据返回数据头，没有头的话数据出不来的
			//middleware数据接口
				middleware: function(req,res,next){
				var pathName = url.parse(req.url).pathname
				data.forEach(function(i){
					switch(i.route){    //i.route是循环的每个对象
						case pathName:{
							i.handle(req,res,next,url)
						}
						break;
					}
				})
			}
		}))

})


