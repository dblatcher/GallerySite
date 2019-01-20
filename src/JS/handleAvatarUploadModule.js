var wrapper = function (siteSettings){
	var fs = require("fs");
	
	var handler = function(request, response) {	
		var serverUrl = "./public/" + siteSettings.avatarPicPath;
		var clientUrl = siteSettings.avatarPicPath;	
		
		console.log('---incoming avatar image:');
		var newImage = request.files.newImage;
		console.log(newImage.name, newImage.size) ;
		var newFileName = newImage.name;
		
		var validationIssues =[];		
		if (!newImage){ validationIssues.push('no file')	};
		if (newImage.type.indexOf('image/') ===-1){ validationIssues.push('not image!')	};
		if (newImage.size > siteSettings.avatarPicMaxSize) {validationIssues.push('too big!')};
		if (validationIssues.length) {
			sendResponseToClient ("PROBLEMS WITH FILE!",false,validationIssues);
			return false;
		}
		

		
		for (var i=0; i<siteSettings.avatarPics.length; i++){
			if (siteSettings.avatarPics[i] === clientUrl + '/'+ newFileName) {
				sendResponseToClient ("There is already an avatar on the server with the file name "+ newFileName +". Please rename the new file if it is a different picture." ,false,'duplicate fileName');
				return false;
			};
		};
		
		
		saveFile(newImage)
		.then ( (result) => {
			siteSettings.avatarPics.push(clientUrl + '/' + newImage.name);	
			sendResponseToClient('SUCCESSFUL UPDATE', siteSettings.avatarPics, '#SUCCESSFUL');		
			return;			
		})
		.catch ( (error) => {
			sendResponseToClient ("SERVER ERROR!",false,error);
		});
		
		return true;
		
		function saveFile(file) {
			return new Promise ( function (resolve,reject){
				var newPath = serverUrl + '/' + file.name;

				fs.copyFile(file.path, newPath, function (err) {
					if (err) {reject(err)};
					resolve('saved:' + file.name);
				});		

			});
		};		
			
		function sendResponseToClient(clientMessage = "Default Client Message", data = false, serverMessage = "Default server Message"){	
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