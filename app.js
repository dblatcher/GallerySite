var express = require('express');
var app = express();
var server = require('http').Server(app);

var port = process.env.PORT || 8080;

var navBar = [
	{title:"home", path:'../'},
	{title:"about",path:'../about'}
];

var gallery = require('./src/js/getGalleries.js')();

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('normalPage', {title: 'Home Page', navBar:navBar, galleries:gallery, content:'home'});
});

server.listen(port);
console.log('running server on port '+ port);