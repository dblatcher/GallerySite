var config = require('./siteConfig.js');
var authenticationEnabled = config.authenticationEnabled;
var siteSettings = config.siteSettings;
var pages = config.pages;
var errorPageViewName = config.errorPageViewName;
var get404ErrorMessage = config.get404ErrorMessage;

var getErrorPageData = function (errorMessage, request) {
	return {
		title: 'error',
		content:'errorMessage',
		styleSheets:[],
		scripts:[],
		
		navBar:pages,
		posts:posts,
		galleries:gallery,
		siteSettings:siteSettings,
		errorMessage:errorMessage,
		sessionMessage:null,
		username:request.user ? request.user.username : false 
	};
}




var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require ('path');
var port = process.env.PORT || 8080;

var formidableMiddleware = require('express-formidable');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");

var getGalleries = require('./src/js/getGalleries.js');
var getPosts = require('./src/js/getPosts.js');
var getAvatarPics = require('./src/js/getAvatarPics.js');
var myPassportModule = require ('./src/js/myPassportModule');

var gallery = getGalleries(siteSettings);
var galleryRouter = require('./src/routes/galleryRoutes')(pages,siteSettings,gallery);

var posts = getPosts(siteSettings);
siteSettings.avatarPics = getAvatarPics(siteSettings);
var postRouter =  require('./src/routes/newsRoutes')(pages,siteSettings,posts);

app.use(express.static('public'));
app.use(formidableMiddleware());
app.use(session({ secret: "fjhubdjuj", resave:true, saveUninitialized:false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', './src/views');
app.set('view engine', 'ejs');


pages.forEach (function (page) {
	if (page.requiresLogin && authenticationEnabled) {
		app.use(page.path,myPassportModule.checkIfUserLoggedIn)		
	};
	
	app.get(page.path, function(req,res){
		var messagePassedFromSession = null;
		if (req.session.message) {
			messagePassedFromSession = req.session.message;
			req.session.message = null;
		};
		res.render(page.viewName, {
			title: page.title,
			navBar:pages,
			galleries:gallery,
			posts:posts,
			content:page.content,
			styleSheets:page.styleSheets,
			scripts:page.scripts,
			siteSettings:siteSettings,
			sessionMessage:messagePassedFromSession,
			username:req.user ? req.user.username : false
		});
	});
});

app.use('/gallery',galleryRouter);
app.use('/news',postRouter);
app.post('/login', myPassportModule.attemptLogIn);
app.use('/logout',myPassportModule.logUserOut);


var handleGalleryUpdateModule = require ('./src/js/handleGalleryUpdateModule');
var handleNewsPostUpdateModule = require ('./src/js/handleNewsPostUpdateModule');
var handleAvatarUploadModule = require ('./src/js/handleAvatarUploadModule');

if (authenticationEnabled) {app.post('/galleryUpdateUpload', myPassportModule.checkUserBeforeAcceptingPost)};
app.post('/galleryUpdateUpload', handleGalleryUpdateModule(gallery));

if (authenticationEnabled) {app.post('/newspostsupload', myPassportModule.checkUserBeforeAcceptingPost)};
app.post('/newspostsupload', handleNewsPostUpdateModule(posts));

if (authenticationEnabled) {app.post('/newavatarupload', myPassportModule.checkUserBeforeAcceptingPost)};
app.post('/newavatarupload', handleAvatarUploadModule(siteSettings));


app.use(function (req, res, next) {
	var errorMessage = get404ErrorMessage(req);
  res.status(404).render(errorPageViewName, getErrorPageData(errorMessage, req) );
})
app.use(function (err, req, res, next) {
  res.status(500)
  res.render(errorPageViewName, getErrorPageData(err, req));
});


server.listen(port);
console.log('running server on port '+ port);