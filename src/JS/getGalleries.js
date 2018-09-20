fs = require("fs");

function getGalleries() {
	var serverUrl = "./public/galleries";
	var clientUrl = "galleries/";
	var imageFileTypes = ['jpg','tif','gif','png','bmp'];
	
	var galleriesFolder = fs.readdirSync(serverUrl);
	var folders = [], folderContents = [], galleries = [], galleryInfo = {};

	for (var i = 0; i<galleriesFolder.length; i++) {
		if ( fs.statSync(`${serverUrl}/${galleriesFolder[i]}`).isDirectory() ) {
			folders.push(galleriesFolder[i]);
		};	
	}

	for (var i = 0; i<folders.length; i++) {
		folderContents = fs.readdirSync(`${serverUrl}/${folders[i]}`)
		galleryInfo = {};

		if (folderContents.indexOf('info.json') !== -1) {
			galleryInfo = JSON.parse (fs.readFileSync(`${serverUrl}/${folders[i]}/info.json`, 'utf8'));
		} else if (folderContents.indexOf('description.txt') !== -1) {
			galleryInfo.description = fs.readFileSync(`${serverUrl}/${folders[i]}/description.txt`, 'utf8');
		} 
		
		if (folderContents.filter(isImage).length > 0) {
			galleries.push(new Gallery (
				folders[i],
				folderContents.filter(isImage),
				galleryInfo 
			));
		}
		
	};

	
	return galleries;

	function isImage(name) {
		if (imageFileTypes.indexOf(fileExtension(name)) !== -1 ) {return true};
		return false;
		function fileExtension (name) {
			return name.slice(name.lastIndexOf('.')+1,name.length);
		};
	}

	function Gallery(title,picture,info) {
		this.title = title;
		this.picture = picture;
		this.path = clientUrl + title + "/";
		
		this.description = info.description || null;
		this.background = info.background || null;
		
		this.indexOfMainImage = info.mainImage ? picture.indexOf(info.mainImage) : 0;
		if (this.indexOfMainImage == -1 ) {
			console.log(`Could name find mainImage defined in info file. ${info.mainImage} is not a picture in the ${title} folder.`);
			this.indexOfMainImage == -0;
		};
	};

};

module.exports = getGalleries;