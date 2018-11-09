
var handler = function(request, response){	
	console.log('---files and data incoming---');
	console.log("We got data about " + request.fields.displayTitle);
	
	var fileKeys = [];
	if (request.files) {fileKeys = Object.keys(request.files)};
	
	fileKeys.forEach(function(key){
		var file = request.files[key];
		console.log('name: ' + file.name + ' ');
		/*file.mv('uploaded/'+file.name, function(err) {
			if (err) {
				console.log(err);
				return response.status(500).send(err);
			} else {
				console.log(file.name + ' uploaded');
			}
		});	*/
	});
	
	response.send('All '+ fileKeys.length +' files received!');	
	console.log('--done--');

}




module.exports = handler;