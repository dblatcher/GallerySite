fs = require("fs");

function getGalleries() {
	var serverUrl = "./public/galleries";
	var clientUrl = "galleries/";
	var imageFileTypes = ['jpg','tif','gif','png','bmp'];
	
	var galleriesFolder = fs.readdirSync(serverUrl);
	var folders = [];

	for (var i = 0; i<galleriesFolder.length; i++) {
		if ( fs.statSync(`${serverUrl}/${galleriesFolder[i]}`).isDirectory() ) {
			folders.push(galleriesFolder[i]);
		};	
	}

	var galleries = [], folderContents = [], descriptionIndex, descriptionText;
	for (var i = 0; i<folders.length; i++) {
		folderContents = fs.readdirSync(`${serverUrl}/${folders[i]}`)
		
		descriptionIndex = folderContents.indexOf('description.txt');
		if (descriptionIndex !== -1) {
				descriptionText = fs.readFileSync(`${serverUrl}/${folders[i]}/${folderContents[descriptionIndex]}`, 'utf8');
		} else descriptionText = null;
		
		galleries.push(new Gallery (
			folders[i],
			folderContents.filter(isImage),
			descriptionText 
		));
		if (galleries[galleries.length-1].picture.length === 0 ) {galleries.pop()};
	};

	return galleries;

	function isImage(name) {
		if (imageFileTypes.indexOf(fileExtension(name)) !== -1 ) {return true};
		return false;
		function fileExtension (name) {
			return name.slice(name.lastIndexOf('.')+1,name.length);
		};
	}

	function Gallery(title,picture,description) {
		this.title = title;
		this.picture = picture;
		this.description = description;
		this.path = clientUrl + title + "/";
	};

};

module.exports = getGalleries;