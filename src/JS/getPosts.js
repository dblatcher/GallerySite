fs = require("fs");
var serverUrl = "./public/posts";
var clientUrl = "posts/";


function getPosts(siteSettings) {
	var files = fs.readdirSync(serverUrl);
	var posts = [];

	for (var i = 0; i<files.length; i++) {
		if (files[i] === "posts.json") {
			try {
				posts = (
					JSON.parse(fs.readFileSync(serverUrl + '/' + files[i], 'utf8'))
				);
			} catch(err) {
				console.log(`Error in json file for the ${files[i]}!`);
			}
		};
	}

	posts.sort(function(a,b){
		return a.index-b.index;
	});
	
	return posts;

};

module.exports = getPosts;