var wrapper = function (currentGalleryData){
	var fs = require("fs");
	const delberateFail = false;

	var handler = function(request, response){	
		console.log('---files and data incoming---');
		
		if (delberateFail) {
			console.log( 'deliberate fail for testing' );
			response.status(500);
			response.send({success:false, message:"test fail"});
			return false;
		};
		
	
		console.log("current galleries =  " + currentGalleryData.length);
		console.log("server received data about " + request.fields.title);
		var fileKeys = [];
		if (request.files) {fileKeys = Object.keys(request.files)};
		console.log("new files:");
		fileKeys.forEach(function(key){
			var file = request.files[key];
			console.log('name: ' + file.name + ' ');
		});
		console.log("picture to remove:");
		console.log(request.fields.picturesToRemove);
		console.log('------');

		
		let picPath = function(picFileName) {
			return '../galleries/' + request.fields.title + '/' + picFileName;
		};
		
		// TO DO
		//verify request.fields.title is a real gallery subfolder
		// respond with fail message if not
		// handle the 'main' property
		
		// TO DO
		//Promise.All:
		//	write updated info.JSON file and save in subfolder
		//	use mv method to copy file objects to subfolder
		//	create 'archive' subfolder in gallery subfolder (if not there already)
		//	move picturesToRemove to archive folder
		//then:
		//	update currentGalleryData[x] 
		//	response.send revised data on
		//remove dummy data sending
		
		//check for conflicts caused by the app level watcher - remove? 
		
		var revisedGallery = {
			displayTitle: "fooBar",
			main:0,
			picture:[picPath("cat.gif")]
		}
		
		response.send({
			success:true, 
			message:"Test success message with dummy data",
			data: revisedGallery
		});

		
	
	}


	return handler;
}

module.exports = wrapper;