var express = require('express');
var getGalleries = require('../js/getGalleries.js');
var galleryRouter = express.Router();

var router = function(navBar,siteSettings) {
	
	galleryRouter.route('/')
		.get(function (req, res){
			res.redirect('/');
		});

	galleryRouter.route('/:id')
		.get(function (req, res){
			galleries = getGalleries(siteSettings);
			var id = req.params.id;
			var foundGallery = findGallery(id,galleries);
			
			if (foundGallery) {
				res.render('galleryPage', {gallery:foundGallery, navBar:navBar, siteSettings:siteSettings});
			} else {
				res.render('errorPage',{errorMessage:`There is no gallery called \'${id}\'.`, navBar:navBar,siteSettings:siteSettings});
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