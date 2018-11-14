var wrapper = function (currentGalleryData){
	var fs = require("fs");
	const serverUrl = "./public/galleries";

		// TO DO write updated info.JSON file and save in folder - in promise chain
		// TO DO : set (UpdatedGallery.main) to copyOfPictureArray.indexOf(request.fields.nameOfMainImage) when client side implements
	
	var handler = function(request, response){	
		console.log('---incoming gallery update:'+ request.fields.title +' ---');
		
		var gIndex = -1;
		for (var i = 0; i < currentGalleryData.length; i++) {
			if (currentGalleryData[i].title === request.fields.title) {gIndex = i;	break;}
		};
		if (gIndex === -1) { 
			sendResponseToClient (request.fields.title + "isn't a gallery.",false,'#client posted update on gallery that doesn\'t exist');
			return;
		};
		
		var copyOfPictureArray = [...currentGalleryData[gIndex].picture];
		
		var picturesToRemove;
		if (typeof(request.fields.picturesToRemove) === 'string') {
			picturesToRemove = (request.fields.picturesToRemove.length > 0) ? request.fields.picturesToRemove.split(',') : [];
		} else {
			picturesToRemove = request.fields.picturesToRemove;
		};
		for (var i=0; i<picturesToRemove.length; i++) {
			picturesToRemove[i] = decodeURI(picturesToRemove[i]);
		}
		
		for (var i = 0; i < copyOfPictureArray.length; i++ ) {
			if (picturesToRemove.includes(copyOfPictureArray[i])) {
				copyOfPictureArray[i] = false;
			};
		};
		copyOfPictureArray = copyOfPictureArray.filter( item => item);
		
		var fileKeys = [], picturesToAdd = [];
		if (request.files) {fileKeys = Object.keys(request.files)};
		fileKeys.forEach(function(key){
			picturesToAdd.push(request.files[key].name);
		});
		copyOfPictureArray.push(...picturesToAdd);

		
		//console.log('picturesToRemove');
		//console.log(picturesToRemove);
		//console.log('picturesToAdd');
		//console.log(picturesToAdd);
		
		
		var updatedGallery = {
			title: currentGalleryData[gIndex].title,
			displayTitle : request.fields.displayTitle,
			picture: copyOfPictureArray,
			path: currentGalleryData[gIndex].path,
			description : request.fields.description,
			background : request.fields.background,
			foreground : request.fields.foreground,
			main : 0,
		}

		
		createArchiveSubfolder(currentGalleryData[gIndex].title)
			.then(function(result){	
				
				var subPromises = [];
				for (var i = 0; i<picturesToRemove.length; i++) {
					subPromises.push( moveExistingFileToArchive(picturesToRemove[i],currentGalleryData[gIndex].title) ); 
				};
				for (var i = 0; i<fileKeys.length; i++) {
					subPromises.push( saveFileToServer(request.files[fileKeys[i]],currentGalleryData[gIndex].title) ); 
				}
				return Promise.all(subPromises);
			})
			.then(function(results) {
				console.log(results);
				currentGalleryData[gIndex] = updatedGallery;
				sendResponseToClient ("successful update.",updatedGallery,'successful update');
			})	
			.catch(function(error){
				console.log('# error #');
				sendResponseToClient ("an error occurred!",false,error);
			});

		
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
							resolve('archive folder created');
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