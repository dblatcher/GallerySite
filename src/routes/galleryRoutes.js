var express = require('express');
var galleryRouter = express.Router();

var router = function(galleries,navBar) {

	var foundGallery;

	galleryRouter.route('/')
		.get(function (req, res){
			res.redirect('/');
		});

	galleryRouter.route('/:id')
		.get(function (req, res){
			var id = req.params.id;
			foundGallery = findGallery(id,galleries);
			
			if (foundGallery) {
				res.render('galleryPage', {gallery:foundGallery, navBar:navBar});
			} else {
				res.send('There is no gallery called \'' + id + '\'.');
			}
		});
	
	return galleryRouter;
}	
	
function findGallery(id,galleries) {
	for (var loop=0; loop<galleries.length; loop++){
		if (id === galleries[loop].title) {
			return galleries[loop];
		}
	}
	return false;
}
	
	
module.exports = router;