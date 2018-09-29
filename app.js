var express = require('express');
var app = express();
var server = require('http').Server(app);
var getGalleries = require('./src/js/getGalleries.js');

var port = process.env.PORT || 8080;

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
];

var gallery = getGalleries(siteSettings);
var galleryRouter = require('./src/routes/galleryRoutes')(pages,siteSettings);

var watcher = fs.watch('./public/galleries',{recursive:true},
(eventType,fileName) => {
	console.log(`${eventType} detected in ${fileName}.`);
	gallery = getGalleries(siteSettings);
});

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');


pages.forEach (function (page) {
	app.get(page.path, function(req,res){
		res.render(page.viewName, {title: page.title, navBar:pages, galleries:gallery, siteSettings:siteSettings});
	});
});

app.use('/gallery',galleryRouter);

app.use(function (req, res, next) {
  res.status(404).render('errorPage', {errorMessage:"404 - file not found", navBar:pages,siteSettings:siteSettings });
})

app.use(function (err, req, res, next) {
  res.status(500)
  res.render('errorPage', {errorMessage:err, navBar:pages,siteSettings:siteSettings });
});

server.listen(port);
console.log('running server on port '+ port);