var wrapper = function (sitePostData){
	var fs = require("fs");
	const serverUrl = "./public/posts";
	const clientPathUrl = "posts/";
	const acceptableTypes = ['p','img','a','img2'];
	
	var handler = function(request, response) {	
		console.log('---incoming news update:');
		
		// form data is passed as string
		try {
			var posts = JSON.parse(request.fields.posts);
		} catch(err) {
			sendResponseToClient("bad data received!",false,'#FAILURE: '+err.message);	
			return;
		};
			
		// validate data
		if (typeof(posts) !== 'object' || typeof(posts.length) !== 'number') {
			sendResponseToClient("bad data received!",false,'#FAILURE: '+"Data wasn't array");	
			return;
		};
		var problem;
		for (i=0; i< posts.length; i++) {
			problem = findPostProblem(posts[i]);
			if (problem) {
					sendResponseToClient("bad data received!",false,'#FAILURE: in post #'+ i +": " + problem);	
					return; 
			};
		};
		
		// data is valid
		
		for (i=0; i< posts.length; i++) {
			posts[i].titleURL = convertToKebabCase(posts[i].title);
			
		};
		function convertToKebabCase(string) {
			string = string.toLowerCase().trim();
			string = string.replace(/\s+/g,"-");
			var permittedCharacters="abcdefghijklmnopqrstuvwxyz0123456789-";
			for (var p = 0; p< string.length; p++){
				if (permittedCharacters.includes(string.charAt(p)) === false) {
					string = string.slice(0,p) + string.slice(p+1,string.length);
				}
			}
			return string;
		};
		
		//save over posts.JSON, update sitePostData
		
		writeNewPostsFile(posts)
		.then ( (result) => {
			while(sitePostData.length) {sitePostData.pop()};
			sitePostData.push(...posts);
			sendResponseToClient('SUCCESSFUL UPDATE', sitePostData, '#SUCCESSFUL');		
			return;			
		})
		.catch ( (error) => {
			console.log(error);
			sendResponseToClient ("SERVER ERROR!",false,error);
		});
		
		
		
		function writeNewPostsFile(data) {
			return new Promise ( function (resolve,reject){
				var path = serverUrl + '/posts.json' ;
				var content = JSON.stringify(data);
				fs.writeFile(path, content, 'utf8', function(err){
					if (err) {reject(err)};
					resolve('created new posts file.');
				});
			});
		};		
		
		function findPostProblem(post) {
			if (typeof(post) !== 'object') {return 'not object'};
			var propsToTest = [
				{key:'title',type:'string'},
				{key:'date',type:'string'},
				{key:'icon',type:'string'},
				{key:'body',type:'object'},
				{key:'active',type:'boolean'},
				{key:'notForHomepage',type:'boolean'},
				{key:'author',type:'string'},
			];
			var errorList = [];
			
			for (var r = 0; r< propsToTest.length; r++) {
				if (typeof(post[propsToTest[r].key]) !== propsToTest[r].type) {
					errorList.push ( '' + propsToTest[r].key + ' not a ' + propsToTest[r].type);
				};
			};
			
			//test body
			if (typeof(post.body) === 'object' && typeof(post.body.length) !== 'number' ) {
				errorList.push += 'body not an array';
			} else {
				for (var r = 0; r< post.body.length; r++) {
					if (typeof(post.body[r]) !== 'object') {
						errorList.push ('body#'+ r + ' not an object');
						continue;
					};
					if (acceptableTypes.indexOf(post.body[r].type) === -1) {
						errorList.push ('body#'+ r + '.type(' + post.body[r].type + ') not valid');
					};
					if (typeof(post.body[r].content) !== 'string') {						
						errorList.push ( 'body#'+ r + '.content not a string, ');
					};
				};
			};
			
			if (errorList.length == 0) {return false};
			return errorList;
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