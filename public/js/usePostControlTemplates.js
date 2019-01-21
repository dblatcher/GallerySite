document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));
document.getElementById('dataHolder').avatarPicMaxSize = Number(document.getElementById('dataHolder').getAttribute('avatarPicMaxSize'));
resetControls();


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