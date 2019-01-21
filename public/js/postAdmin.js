document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));
document.getElementById('dataHolder').avatarPicMaxSize = Number(document.getElementById('dataHolder').getAttribute('avatarPicMaxSize'));
resetControls();

function handleClassToggleClick(element,className) {
	var nextParent = element.parentElement;
	while (nextParent.classList.contains('postControl') == false){
		nextParent = nextParent.parentElement;
		if (!nextParent) {return false;}
	}	
	nextParent.classList.toggle(className);
}

function handleNewBodyClick(element,type) {
	element.parentElement.insertAdjacentElement("afterend",makeInsertPanel());
	element.parentElement.insertAdjacentElement("afterend",makeBodyItem({type:type}));
}

function handleDeleteBodyClick (element) {
	
	var nextParent = element.parentElement;
	var failsafe=0;
	while (nextParent.classList.contains('bodyItem') == false){
		nextParent = nextParent.parentElement;
		if (failsafe++ > 100) {return false;}
	}
	var container = nextParent.parentElement;
	var panel = nextParent.nextSibling;
	container.removeChild(panel);
	container.removeChild(nextParent);
}

function handleDeletePost (element) {
	var nextParent = element.parentElement;
	var failsafe=0;
	while (nextParent.classList.contains('postControl') == false){
		nextParent = nextParent.parentElement;
		if (failsafe++ > 100) {return false};
	}
	nextParent.parentElement.removeChild(nextParent);
}

function handleIconClick (element) {
	element.classList.add('iconBeingChanged');
	document.getElementById('avatarForm').classList.add('modalShow');
};

function handleIconSelect (element) {
	document.getElementById('avatarForm').classList.remove('modalShow');
	var target = document.getElementsByClassName('iconBeingChanged')[0];
	target.src=element.src;
	target.classList.remove('iconBeingChanged');
}

function handleMoveControl(element, direction) {
	var control = element.parentElement;
	while (control.classList.contains('postControl') == false){
		control = control.parentElement;
		if (!control) {return false};
	}	
	var controlCollection = document.getElementsByClassName('postControl');
	
	var index;
	for (var i = 0; i < controlCollection.length; i++) {
		if (controlCollection[i] === control ) {index = i; break}
	}
	
	if (direction == 'down') {
		if (index > 0) {
			control.parentElement.insertBefore(control,control.parentElement.children[index-1]);
		};
	};
	
	if (direction == 'up') {
		if (index < controlCollection.length-1) {
			control.parentElement.insertBefore(control,control.parentElement.children[index+2]);
		};
	};
}

function handleChangedAvatarInput() {
	var messageElement = document.getElementById('avatarUploadErrorMessage');
	messageElement.innerText = "";
};

function handleUploadAvatar () {
	var control = document.getElementById('newAvatarInput');
	var messageElement = document.getElementById('avatarUploadErrorMessage');
	var file = control.files[0];
	var maxSize = document.getElementById('dataHolder').avatarPicMaxSize;

	var waitMessage = document.getElementById('waitMessage');
	if (waitMessage.classList.contains("modalShow")) {return false};	
	messageElement.innerText = "";
	
	if (!file){
		messageElement.innerText = "select an image file first"
		return false;
	}
	if (file.type.indexOf('image/')==-1){	
		messageElement.innerText = file.name + " is not an image file."
		return false;
	}
	if (file.size > maxSize){	
		messageElement.innerText = file.name + " is too large a file("+ showWithUnit(file.size)+ "). The max size for an avatar pic is set to " + showWithUnit(maxSize) + "."
		return false;
	}
	
	waitMessage.classList.add("modalShow");
	
	var formData = new FormData();
	formData.append('newImage',file);
	var parsedResponse;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "newavatarupload", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {return false};
		
		try {
			parsedResponse = JSON.parse(xhr.response);
			alert (parsedResponse.message ? JSON.parse(xhr.response).message : "Undefined Error")
		} catch {
			alert('non json response');
			console.error(xhr.response);
		};
		
		if (xhr.status == 200) {
			var avatarChoices = document.getElementById('avatarChoices');		
			var newChoice = document.createElement("img");
			newChoice.setAttribute('src', parsedResponse.data[parsedResponse.data.length-1]);
			newChoice.setAttribute('onclick', "handleIconSelect(this)");
			avatarChoices.appendChild(newChoice);
		};
		
		waitMessage.classList.remove("modalShow");
		
	};
	xhr.send(formData);
	
	function showWithUnit(bytes) {
		if (bytes > 1000000) {return ((bytes - (bytes%100000)) / 1000000)+"MB";}
		return ((bytes - (bytes%100)) / 1000)+"KB"; 
	};
	
};

function publishChangesToServer() {
	var waitMessage = document.getElementById('waitMessage');
	if (waitMessage.classList.contains("modalShow")) {return false};
	waitMessage.classList.add("modalShow");
	
	var data = getDataFromInput();
	var formData = new FormData();
	formData.append('posts',JSON.stringify(data));
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "newspostsupload", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {return false};
		
		try {
			var parsedData = JSON.parse(xhr.response);
			alert (parsedData.message ? JSON.parse(xhr.response).message : "Undefined Error")
		} catch {
			alert('non json response');
		};
		
		if (xhr.status == 200) {	
		}
		
		waitMessage.classList.remove("modalShow");
		
	};
	xhr.send(formData);
	
	
}

function getDataFromInput() {
	var postControls = document.getElementsByClassName('postControl');
	var data = [];
	for (var i=0; i < postControls.length; i++) {
		data.push(readPostControl(postControls[i],i));
	};
	
	console.log(data);
	return data;
	
	function readPostControl(postControl, index){
		var inputs = postControl.getElementsByTagName('input');
		var post = {
			index:index,
			title: inputs[0].value,
			date: inputs[1].value,
			icon:truncatePath(postControl.getElementsByClassName('iconPart')[0].src),
			notForHomepage: postControl.classList.contains('notForHomePage'),
			active: postControl.classList.contains('active'),
			body:[]
		}
		
		var bodyItems = postControl.getElementsByClassName('bodyItem');
				for (var i=0; i < bodyItems.length; i++) {
					post.body.push(readBodyItem(bodyItems[i]));
				};
		return post;
		
		function readBodyItem(bodyItem){
			var element =  bodyItem.getElementsByClassName('bodyContent')[0].children[0];
			var type = bodyItem.type.toLowerCase();
			
			var content;
			if (type === 'p') {
				content = element.value;
			};
			if (type === 'a') {
				content = element.value;
			};
			if (type === 'img') {
				content = truncatePath(element.src);
			};
			return {type:type,content:content};
		}
		function truncatePath(fullUrl){
			var base = window.location.origin; 
			return fullUrl.substring(base.length+1);
		}
		
	}
	
}

function resetControls () {
	var data = document.getElementById('dataHolder').data;
	var controlHolder = document.getElementById('controlHolder');
	while (controlHolder.childElementCount) {controlHolder.removeChild(controlHolder.firstElementChild)}; 
	
	for (var i = 0; i < data.length; i++) {
		document.getElementById('controlHolder').appendChild(makePostControl(data[i]));
	}
};

function addNewPostControl () {
	var today = new Date;
	dateString = '' + today.getFullYear() + '-' 
	dateString += (today.getMonth()+1 < 10) ? '0'+(today.getMonth()+1) : (today.getMonth()+1);
	dateString += '-'
	dateString += (today.getDate() <10) ? '0'+today.getDate() : today.getDate();
	
	document.getElementById('controlHolder').appendChild(makePostControl( {
		title:'(new post)',
		date:dateString,
		icon:'',
		body:[],
		active:false,
	},true	));
}

function makePostControl(post, isNewPost) {
	var control = document.getElementsByClassName('templatePostControl')[0].cloneNode(true);
	control.setAttribute('class','postControl collapsed');
	if (isNewPost) {control.setAttribute('class','postControl');}
	
	var inputs = control.getElementsByTagName('input');
	inputs[0].value = post.title;
	inputs[1].value = post.date;
	
	//inputs[2].value = post.icon;
	var iconImg = control.getElementsByTagName('img')[0];
	if (post.icon){ iconImg.setAttribute('src', post.icon);}
	
	if (post.active) {control.classList.add('active');};
	if (post.notForHomepage) {control.classList.add('notForHomePage');}
	
	var contentSub = control.getElementsByClassName('content')[0];
	contentSub.appendChild(makeInsertPanel());
	for (var j = 0; j < post.body.length; j++ ) {
		contentSub.appendChild(makeBodyItem(post.body[j]));
		contentSub.appendChild(makeInsertPanel());
	}
	
	return control;
}

function makeBodyItem(body) {
	var bodyItem = document.getElementsByClassName('templateBodyItem')[0].cloneNode(true);
	bodyItem.setAttribute('class','bodyItem');
	bodyItem.type = body.type;
	
	var tagMap = {p:'textArea',img:'img', a:'textArea'};
	
	var bodyContent = bodyItem.getElementsByClassName('bodyContent')[0];
	bodyContent.appendChild(document.createElement(tagMap[body.type]));
	
	switch (body.type) {
	case "p": 
		bodyContent.firstElementChild.innerText = body.content || "type here";
		break;
	case "img" :
		if (body.content) {bodyContent.firstElementChild.setAttribute('src',body.content)};
		break;
	case "a" :
		bodyContent.firstElementChild.classList.add('urlInput');
		bodyContent.firstElementChild.innerText = body.content || "copy link here";
		break;
	}
	
	return bodyItem;
}

function makeInsertPanel() {
	var insertPanel = document.getElementsByClassName('templateInsertPanel')[0].cloneNode(true);
	insertPanel.setAttribute('class','insertPanel');
	return insertPanel;
}