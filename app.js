var siteSettings = {
	siteName:"My Picture Site",
	defaultGalleryBackgroundColor:"white",
	defaultGalleryForegroundColor:"black",
	imageFileTypes : ['jpg','tif','gif','png','bmp']
};

//set title to 'null' if the page should not appear in the navBar
var pages = [
	{path:'/', viewName:'homePage', title:'Home'},
	{path:'/about', viewName:'aboutPage', title:'About'},
	{path:'/gallery', viewName:'galleriesPage', title:'Galleries'},
	{path:'/login', viewName:'loginPage', title:'log in'},
	{path:'/admin', viewName:'adminPage', title:'admin', requiresLogin:true},
];

// THIS SHOULD ONLY BE SET TO FALSE FOR DEVELOPMENT
// IT DISABLES THE AUTHENTICATION MIDDLEWARE
const authenticationEnabled = false;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require ('path');
var port = process.env.PORT || 8080;

const formidableMiddleware = require('express-formidable');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");

var getGalleries = require('./src/js/getGalleries.js');
var myPassportModule = require ('./src/js/myPassportModule');
var handleGalleryUpdateModule = require ('./src/js/handleGalleryUpdateModule');
var galleryRouter = require('./src/routes/galleryRoutes')(pages,siteSettings);

var gallery = getGalleries(siteSettings);

var watcher = fs.watch('./public/galleries',{recursive:true},
(eventType,fileName) => {
	//console.log(`${eventType} detected in ${fileName}.`);
	//gallery = getGalleries(siteSettings);
});



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
			siteSettings:siteSettings,
			sessionMessage:messagePassedFromSession,
			username:req.user ? req.user.username : false
		});
	});
});

app.use('/gallery',galleryRouter);
app.post('/login', myPassportModule.attemptLogIn);
app.use('/logout',myPassportModule.logUserOut);
if (authenticationEnabled) {app.post('/galleryUpdateUpload', myPassportModule.checkUserBeforeAcceptingPost)};
app.post('/galleryUpdateUpload', handleGalleryUpdateModule(gallery));


app.use(function (req, res, next) {
  res.status(404).render('errorPage', {errorMessage:"404 - file not found", navBar:pages,siteSettings:siteSettings, username:req.user ? req.user.username : false });
})

app.use(function (err, req, res, next) {
  res.status(500)
  res.render('errorPage', {errorMessage:err, navBar:pages,siteSettings:siteSettings,username:req.user ? req.user.username : false });
});


server.listen(port);
console.log('running server on port '+ port);