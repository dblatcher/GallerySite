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
	inputs[2].value = post.author;
	
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
	
	var bodyContent = document.getElementsByClassName('templateBodyContent-'+body.type)[0].cloneNode(true);
	bodyContent.setAttribute('class','bodyContent');
	bodyItem.insertBefore(bodyContent,bodyItem.firstElementChild);
	
	var subControls;
	
	switch (body.type) {
	case "p": 
		subControls = bodyContent.getElementsByTagName('textarea');
		subControls[0].innerText = body.content || "";
		break;
	case "img" :
		subControls = bodyContent.getElementsByTagName('img');
		if (body.content) {
			subControls[0].setAttribute('src',body.content)
		};
		break;
	case "a" :
		subControls = bodyContent.getElementsByTagName('textarea');
		subControls[0].innerText = body.content || "";
		subControls[1].innerText = body.displayText || "";
		subControls[2].innerText = body.textAfterLink || "";
		bodyContent.getElementsByTagName('input')[0].checked = body.inline || false;
		break;
	case "img2" :
		subControls = bodyContent.getElementsByTagName('textarea');
		if (body.content) {
			subControls[0].innerText=body.content;
			bodyContent.getElementsByTagName('img')[0].src =  body.content;
		};
		break;
	}
	
	return bodyItem;
}

function makeInsertPanel() {
	var insertPanel = document.getElementsByClassName('templateInsertPanel')[0].cloneNode(true);
	insertPanel.setAttribute('class','insertPanel');
	return insertPanel;
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
			author: inputs[2].value,
			body:[]
		}
		
		var bodyItems = postControl.getElementsByClassName('bodyItem');
				for (var i=0; i < bodyItems.length; i++) {
					post.body.push(readBodyItem(bodyItems[i]));
				};
		return post;
		
		function readBodyItem(bodyItem){

			var type = bodyItem.type.toLowerCase();
			
			var content,displayText,textAfterLink,inline;	
			var subControls;
	
			switch (type) {
			case "p": 
				subControls = bodyItem.getElementsByTagName('textarea');
				content = subControls[0].value;
				break;
			case "img" :
				subControls = bodyItem.getElementsByTagName('img');
				content = truncatePath(subControls[0].src);
				break;
			case "img2" :
				subControls = bodyItem.getElementsByTagName('textarea');
				content = subControls[0].value;
				break;
			case "a" :
				subControls = bodyItem.getElementsByTagName('textarea');
				content = subControls[0].value;
				displayText = subControls[1].value;
				textAfterLink = subControls[2].value;
				inline = bodyItem.getElementsByTagName('input')[0].checked;
				break;
			}
				
			//if (type==='img2') {type='img'};
				
			return {type:type,content:content,displayText:displayText,textAfterLink:textAfterLink, inline:inline};
		}
		function truncatePath(fullUrl){
			if (!fullUrl){return "";}
			if (fullUrl === window.location.href) {return "";}
			var base = window.location.origin; 
			return fullUrl.substring(base.length+1);
		}
		
	}	
}

