var express = require('express');
var getGalleries = require('../js/getGalleries.js');
var galleryRouter = express.Router();

var router = function(navBar) {
	
	galleryRouter.route('/')
		.get(function (req, res){
			res.redirect('/');
		});

	galleryRouter.route('/:id')
		.get(function (req, res){
			galleries = getGalleries();
			var id = req.params.id;
			var foundGallery = findGallery(id,galleries);
			
			if (foundGallery) {
				res.render('galleryPage', {gallery:foundGallery, navBar:navBar});
			} else {
				res.render('errorPage',{errorMessage:`There is no gallery called \'${id}\'.`, navBar:navBar});
			}
		});
	
	return galleryRouter;

	function findGallery(id,galleriesArray) {
		for (var loop=0; loop<galleriesArray.length; loop++){
			if (id === galleriesArray[loop].title) {
				return galleriesArray[loop];
			}
		}
		return false;
	}
}	
	
	
	
module.exports = router;