//TO DO
// rename functions
// switch to arrows for promise chains

var wrapper = function (currentGalleryData){
	var fs = require("fs");
	const serverUrl = "./public/galleries";
	const clientPathUrl = "galleries/";
	
	var handler = function(request, response){	
		console.log('---incoming galleries update:');
		
		// form data is passed as string
		var isNewGallery;
		if (request.fields.isNewGallery === 'false'){isNewGallery = false};
		if (request.fields.isNewGallery === 'true') {isNewGallery = true};
		if (isNewGallery !== false  && isNewGallery !== true){
			sendResponseToClient ("Not defined if this is new gallery or not!",false,'#request.fields.isNewGallery not defined.');
			return;
		}
		
		var galleryTitle;
		if (!request.fields.title) {
			sendResponseToClient ("No gallery title!",false,'#request.fields.title not defined.');
			return;
		};
		galleryTitle = parseToFolderName(request.fields.title);
		function parseToFolderName(string){
			string = string.toLowerCase().trim();
			var permittedCharacters="abcdefghijklmnopqrstuvwxyz0123456789";
			for (var p = 0; p< string.length; p++){
				if (permittedCharacters.includes(string.charAt(p)) === false) {
					string = string.slice(0,p) + "_" + string.slice(p+1,string.length);
				}
			}
			return string;
		}
			
		console.log (isNewGallery ? '--new gallery: ' + galleryTitle  : '--change to '+galleryTitle);
		
		var gIndex = -1;
		for (var i = 0; i < currentGalleryData.length; i++) {
			if (currentGalleryData[i].title === galleryTitle) {gIndex = i;	break;}
		};
	
		if (isNewGallery) {
			if (gIndex !== -1) { 
				sendResponseToClient ("There is already a gallery called " + galleryTitle + ".",false,'#client posted new gallery with a folder name already taken');
				return;
			};
		} else {
			if (gIndex === -1) { 
				sendResponseToClient (galleryTitle + "isn't a gallery.",false,'#client posted update on gallery that doesn\'t exist');
				return;
			};
		}; 
		
		function makeArrayFromFileNameList(list){
			var formattedArray;
			if (typeof(list) === 'string') {
				formattedArray = (list.length > 0) ? list.split(',') : [];
			} else {
				formattedArray = list;
			};
			for (var i=0; i<formattedArray.length; i++) {
				formattedArray[i] = decodeURI(formattedArray[i]);
			};
			return formattedArray;
		};
		
		var picturesToRemove = makeArrayFromFileNameList(request.fields.picturesToRemove);
		var picturesInOrder = makeArrayFromFileNameList(request.fields.picturesInOrder);

		var fileKeys = [];
		if (request.files) {fileKeys = Object.keys(request.files)};

		var mainImageNumber = 0;
		for (var i = 0; i < picturesInOrder.length; i++ ) {
			if (picturesInOrder[i] === decodeURI(request.fields.nameOfMainImage)) {
				mainImageNumber = i;break;
			};
		};
		
		var displayTitle = request.fields.displayTitle ? request.fields.displayTitle : galleryTitle;
		
		var deactivated = request.fields.deactivated === "true" ? true : false;
		if (picturesInOrder.length === 0) {deactivated = true};
		
		var updatedGallery = {
			title: galleryTitle,
			displayTitle : displayTitle,
			picture: picturesInOrder,
			path: clientPathUrl + galleryTitle + '/',
			description : request.fields.description,
			background : request.fields.background,
			foreground : request.fields.foreground,
			main : mainImageNumber,
			deactivated:deactivated
		};

		var updatedInfoFileContents = {
			displayTitle : displayTitle,
			description : request.fields.description,
			background : request.fields.background,
			foreground : request.fields.foreground,
			main:mainImageNumber,
			orderList : picturesInOrder,
			deactivated:deactivated
		};
		
		createNewGalleryFolderIfNeeded(isNewGallery, galleryTitle)
		.then(function(results){
			return createArchiveSubfolder(galleryTitle);
		})
		.then(function(result){	
			var subPromises = [];
			for (var i = 0; i<picturesToRemove.length; i++) {
				subPromises.push( moveExistingFileToArchive(picturesToRemove[i],galleryTitle) ); 
			};
			for (var i = 0; i<fileKeys.length; i++) {
				subPromises.push( saveFileToServer(request.files[fileKeys[i]],galleryTitle) ); 
			}
			subPromises.push(writeNewInfoFile(updatedInfoFileContents,galleryTitle))
			return Promise.all(subPromises);
		})
		.then(function(results) {
			console.log('Actions taken on Server:');
			console.log(results);
			if(isNewGallery) {
				currentGalleryData.push(updatedGallery);
				sendResponseToClient ("successfully created new gallery. Refresh page to edit it.",updatedGallery,'successfully created gallery');
			} else {
				currentGalleryData[gIndex] = updatedGallery;
				sendResponseToClient ("successful update.",updatedGallery,'successfully updated gallery');
			}
		})	
		.catch(function(error){
			console.log(error);
			sendResponseToClient ("an error occurred!",false,error);
		});

		function createNewGalleryFolderIfNeeded(forNewGallery, folder){
			return new Promise ( function (resolve,reject){	
				if (forNewGallery) {
					var path = serverUrl + '/' + folder;
					fs.mkdir(path, { recursive: true }, (err) => {
						if (err) {reject(err)};
						resolve('new gallery folder created.');
					});
				} else {
					resolve('existing gallery - no new folder needed.');
				}		
			});
		};
			
		function writeNewInfoFile(data,folder) {
			return new Promise ( function (resolve,reject){
				var path = serverUrl + '/' + folder +'/info.json' ;
				var content = JSON.stringify(data);
				fs.writeFile(path, content, 'utf8', function(err){
					if (err) {reject(err)};
					resolve('created info file for ' + folder);
				});
			});
		};
		
		function saveFileToServer(file,folder) {
			return new Promise ( function(resolve, reject) {
				var newpath = serverUrl + '/' + folder +'/' + file.name;	
				fs.copyFile(file.path, newpath, function (err) {
					if (err) {reject(err)};
					resolve('saved:' + file.name);
				});				
				
			});
		};
		
		function createArchiveSubfolder (folder) {
			return new Promise ( function(resolve, reject) {
				var path = serverUrl + '/' + folder;
				fs.readdir(path,{withFileTypes:true}, function(err,files){
					if (err) {reject(err)};

					var archiveIsAlreadyThere = function(){
					for (var f = 0; f < files.length; f++) {
						
						console.log  (files[f].name, files[f].isDirectory);
						
						if (files[f].name === "archive"  && files[f].isDirectory()) {
							return true;
						}
					};
					return false;
					}
					
					if (archiveIsAlreadyThere()) {
						resolve('archive folder already present');
					} else {
						fs.mkdir(path+'/archive', { recursive: true }, (err) => {
							if (err) {reject(err)};
							resolve('archive folder created or updated');
						});
					}					
				})
			});
		};
		
		function moveExistingFileToArchive (fileName,folder) {
			return new Promise ( function(resolve, reject) {
				var oldpath = serverUrl + '/' + folder +'/' + fileName;
				var newpath = serverUrl + '/' + folder +'/archive/' + fileName;	
				fs.rename(oldpath, newpath, function (err) {
					if (err) {reject(err)};
					resolve('archived: '+ fileName);
				});				
				
			});
		};
		
		
		function sendResponseToClient(clientMessage = "Default Response Message",data = false, serverMessage = false){	
			var success = data ? true : false; 
			if (serverMessage) {console.log(serverMessage)};
			if (success) {response.status(200)} else {response.status(500)};
			response.send({
				success:success,
				message:clientMessage,
				data:data
			});
			return success;
		};
	
	}
	
	return handler;
}

module.exports = wrapper;