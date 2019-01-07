var express = require('express');
var galleryRouter = express.Router();

var router = function(pages,siteSettings,galleries) {
	
	galleryRouter.route('/:id')
		.get(function (req, res){
			var id = req.params.id;
			var foundGallery = findGallery(id,galleries);
			
			if (foundGallery) {
				var username = req.user ? req.user.username : null ;
				res.render('galleryPage', {
					gallery:foundGallery,
					title:false,
					navBar:pages,
					siteSettings:siteSettings,
					username:username
				});
			} else {
				throw new Error(`There is no gallery called \'${id}\'.`);
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