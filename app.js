var express = require('express');
var app = express();
var server = require('http').Server(app);
var getGalleries = require('./src/js/getGalleries.js');

var port = process.env.PORT || 8080;

var navBar = [
	{title:"home", path:'../'},
	{title:"about",path:'../about'}
];

var siteSettings = {
	siteName:"My Picture Site",
	defaultGalleryBackgroundColor:"white",
	defaultGalleryForegroundColor:"black",
	imageFileTypes : ['jpg','tif','gif','png','bmp']
};

var gallery = getGalleries(siteSettings);
var galleryRouter = require('./src/routes/galleryRoutes')(navBar,siteSettings);

var watcher = fs.watch('./public/galleries',{recursive:true},
(eventType,fileName) => {
	console.log(`${eventType} detected in ${fileName}.`);
	gallery = getGalleries(siteSettings);
});

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');


app.get('/', function(req,res){
	res.render('homePage', {title: 'Home Page', navBar:navBar, galleries:gallery, siteSettings:siteSettings});
});

app.get('/about', function(req,res){
	res.render('aboutPage', {title: 'About', navBar:navBar, galleries:gallery,siteSettings:siteSettings});
});

app.use('/gallery',galleryRouter);

app.use(function (req, res, next) {
  res.status(404).render('errorPage', {errorMessage:"404 - file not found", navBar:navBar,siteSettings:siteSettings });
})

app.use(function (err, req, res, next) {
  res.status(500)
  res.render('errorPage', {errorMessage:err, navBar:navBar,siteSettings:siteSettings });
});

server.listen(port);
console.log('running server on port '+ port);