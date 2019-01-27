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

function showImageMenu(element) {
	var bodyItem = goUpDomUntil('bodyItem',element);
	var gallerySelector = bodyItem.getElementsByTagName('select')[0];
	
	bodyItem.classList.add('imageBeingChanged');
	
	
	var imageChoices = document.getElementsByClassName('imageChoices');
	for (var r=0; r<imageChoices.length; r++) {
		imageChoices[r].classList.add('hidden');
	};
	imageChoices[gallerySelector.value].classList.remove('hidden');
	document.getElementById('chooseImageForm').classList.add('modalShow');
}

function handleImageSelect(element) {
	var imageBeingChanged = document.getElementsByClassName('imageBeingChanged')[0];
	imageBeingChanged.getElementsByTagName('img')[0].src = element.src;
	imageBeingChanged.classList.remove('imageBeingChanged');
	document.getElementById('chooseImageForm').classList.remove('modalShow');
}

function showImageFromURL(element) {
	var bodyItem = goUpDomUntil('bodyItem',element);
	
	bodyItem.getElementsByTagName('img')[0].src = bodyItem.getElementsByTagName('textarea')[0].value;
};

function goUpDomUntil(targetClass,startElement) {
	var nextParent = startElement.parentElement;
	while (nextParent.classList.contains(targetClass) == false){
		nextParent = nextParent.parentElement;
		if (!nextParent) {return false};
	}
	return nextParent;
};