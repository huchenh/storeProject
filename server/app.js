var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goodRouter');
var adminRouter = require('./routes/adminIndex')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//登录拦截
app.use(function(req, res, next) {
	console.log(req.originalUrl)
	if (req.cookies.userId) {
		next()
	} else {
		if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list' || req.originalUrl == '/users/register' || req.originalUrl.indexOf('/admin') > -1) {
			next()
		} else {
			res.json({
				status: '10001',
				msg: '当前未登录',
				result: ''
			})
		}
	}
})
//后台拦截
app.use('/admin', function(req, res, next) {
	next()
})

app.use('/', indexRouter);
app.use('/goods', goodsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;