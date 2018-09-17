var express = require('express');
var app = express();
var server = require('http').Server(app);

var port = process.env.PORT || 8080;

var navBar = [
	{title:"home", path:'../'},
	{title:"about",path:'../about'}
];

var gallery = require('./src/js/getGalleries.js')();

var watcher = fs.watch('./public/galleries',{recursive:true},
(eventType,fileName) => {
	console.log(`${eventType} detected in ${fileName}.`);
	gallery = require('./src/js/getGalleries.js')()
});

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

var galleryRouter = require('./src/routes/galleryRoutes')(gallery,navBar);
app.use('/gallery',galleryRouter);

app.get('/', function(req,res){
	res.render('homePage', {title: 'Home Page', navBar:navBar, galleries:gallery});
});

app.get('/about', function(req,res){
	res.render('aboutPage', {title: 'About', navBar:navBar, galleries:gallery});
});

server.listen(port);
console.log('running server on port '+ port);