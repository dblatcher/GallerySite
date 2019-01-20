var fs = require("fs");


function getAvatarPics(siteSettings) {

	var serverUrl = "./public/" + siteSettings.avatarPicPath;
	var clientUrl = siteSettings.avatarPicPath;

	
	var files = fs.readdirSync(serverUrl);
	var pics = [];

	files.forEach ( function(file) {
		if (isImage(file)) {
			pics.push( siteSettings.avatarPicPath + '/'+ file);
		}
	});
	
	return pics;

	function isImage(name) {
		if (siteSettings.imageFileTypes.indexOf(fileExtension(name)) !== -1 ) {return true;}
		return false;
		function fileExtension (name) {
			return name.slice(name.lastIndexOf('.')+1,name.length).toLowerCase();
		}
	}

}

module.exports = getAvatarPics;