fs = require("fs");
var serverUrl = "./public/posts";
var clientUrl = "posts/";


function getPosts(siteSettings) {
	var files = fs.readdirSync(serverUrl);
	var posts = [];

	for (var i = 0; i<files.length; i++) {
		if (fileExtension(files[i]) === "json") {
			try {
				posts.push(
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

	function fileExtension (name) {
		return name.slice(name.lastIndexOf('.')+1,name.length).toLowerCase();
	};
};

module.exports = getPosts;