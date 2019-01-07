document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));
resetControls();

function handleClassToggleClick(element,className) {
	var nextParent = element.parentElement;
	var failsafe=0;
	while (nextParent.classList.contains('postControl') == false){
		nextParent = nextParent.parentElement;
		if (failsafe++ > 100) {return false};
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
		if (failsafe++ > 100) {return false};
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
	document.getElementsByClassName('iconMenu')[0].classList.remove('hidden');
};

function handleIconSelect (element) {
	document.getElementsByClassName('iconMenu')[0].classList.add('hidden');
	var target = document.getElementsByClassName('iconBeingChanged')[0];
	target.src=element.src;
	target.classList.remove('iconBeingChanged');
}

function handleMoveControl(element, direction) {
	
	
	var control = element.parentElement.parentElement;
	var controlCollection = document.getElementsByClassName('postControl');
	
	var index;
	for (var i = 0; i < controlCollection.length; i++) {
		if (controlCollection[i] === control ) {index = i; break}
	}
	
	if (direction == 'up') {
		if (index > 0) {
			control.parentElement.insertBefore(control,control.parentElement.children[index-1]);
		};
	};
	
	if (direction == 'down') {
		if (index < controlCollection.length-1) {
			control.parentElement.insertBefore(control,control.parentElement.children[index+2]);
		};
	};
	
	
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
	
	var tagMap = {p:'textArea',img:'img'};
	
	var bodyContent = bodyItem.getElementsByClassName('bodyContent')[0];
	bodyContent.appendChild(document.createElement(tagMap[body.type]));
	
	switch (body.type) {
	case "p": 
		bodyContent.firstElementChild.innerText = body.content || "type here";
	case "img" :
		if (body.content) {bodyContent.firstElementChild.setAttribute('src',body.content)};
	}
	
	return bodyItem;
}

function makeInsertPanel() {
	var insertPanel = document.getElementsByClassName('templateInsertPanel')[0].cloneNode(true);
	insertPanel.setAttribute('class','insertPanel');
	return insertPanel;
}