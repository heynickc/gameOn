/**
 * Module dependencies.
 */

var _ = require('underscore');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var cors = require('cors');
var methodOverride = require('method-override');
var MongoStore = require('connect-mongo')({
	session: session
});
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var notifyController = require('./controllers/notify');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
	console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

if (process.env.NODE_ENV == 'development') {
	var csrfWhitelist = [];
}

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
	paths: ['public/css', 'public/js'],
	helperContext: app.locals
}));
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	secret: secrets.sessionSecret,
	store: new MongoStore({
		url: secrets.db,
		auto_reconnect: true
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	// Conditional CSRF.
	if (_.contains(csrfWhitelist, req.path) || (process.env.NODE_ENV == 'development')) return next();
	csrf(req, res, next);
});
app.use(cors());
app.use(function (req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: week
}));
app.use(function (req, res, next) {
	// Keep track of previous URL to redirect back to
	// original destination after a successful login.
	if (req.method !== 'GET') return next();
	var path = req.path.split('/')[1];
	if (/(auth|login|logout|signup)$/i.test(path)) return next();
	req.session.returnTo = req.path;
	next();
});

/**
 * Application routes.
 */

app.get('/', homeController.index);
app.post('/notify', notifyController.postNotify);
app.post('/testNotify', notifyController.postTestNotify);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/api/users', apiController.getUsers);
app.put('/api/users/:_id', apiController.putUser);
app.delete('api/users/:_id', apiController.deleteUser);
app.post('/api/users', apiController.postUser);

/**
 * 500 Error Handler.
 * As of Express 4.0 it must be placed at the end of all routes.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function () {
	console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;