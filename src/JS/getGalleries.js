fs = require("fs");
var serverUrl = "./public/galleries";
var clientUrl = "galleries/";


function getGalleries(siteSettings) {
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
			try {
				galleryInfo = JSON.parse (fs.readFileSync(`${serverUrl}/${folders[i]}/info.json`, 'utf8'));
			} catch(err) {
				console.log(`Error in info.json file for the ${folders[i]} gallery.`);
			}
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
		if (siteSettings.imageFileTypes.indexOf(fileExtension(name)) !== -1 ) {return true};
		return false;
		function fileExtension (name) {
			return name.slice(name.lastIndexOf('.')+1,name.length).toLowerCase();
		};
	}

	function Gallery(title,picture,info) {
		this.title = title;
		this.displayTitle = info.displayTitle || title;
		this.picture = picture;
		this.path = clientUrl + title + "/";
		
		this.description = info.description || null;
		this.background = info.background || siteSettings.defaultGalleryBackgroundColor;
		this.foreground = info.foreground || siteSettings.defaultGalleryForegroundColor;
		this.main = info.mainImage ? picture.indexOf(info.mainImage) : 0;
		if (this.main == -1 ) {this.main == 0;};
	};

};

module.exports = getGalleries;