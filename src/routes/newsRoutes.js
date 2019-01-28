var express = require('express');
var newsRouter = express.Router();

var router = function(pages,siteSettings,posts) {
	
	newsRouter.route('/:id')
		.get(function (req, res){
			var id = req.params.id.toLowerCase();
			var foundPost = findPosts(id,posts);
			
			if (foundPost) {
				var username = req.user ? req.user.username : null ;
				res.render('postPage', {
					post:foundPost,
					title:false,
					navBar:pages,
					siteSettings:siteSettings,
					username:username
				});
			} else {
				throw new Error(`There is no post called \'${id}\'.`);
			}
		});
	
	return newsRouter;

	function findPosts(id,postArray) {
		for (var loop=0; loop<postArray.length; loop++){
			if (id === postArray[loop].titleURL && postArray[loop].active) {
				return postArray[loop];
			}
		}
		return false;
	}
}	
	
	
	
module.exports = router;