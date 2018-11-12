document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));

function handleSelect(gallery) {
	var section = document.getElementsByClassName('editSection');
	for (i=0; i<section.length; i++) {
		section[i].style.display = 'none';
	}
	document.getElementById('edit'+gallery).style.display = 'block';
}

function handleThumbClick(element){
	element.classList.toggle('current');
	element.classList.toggle('deleted');	
}

function handleUploadControlClick(element){
	var input = element.getElementsByClassName('hiddenFileInput')[0];
	if (input.files.length === 0) {	
		input.click() // leads to handleFiles call if user selects a file.
	} else {
		element.parentElement.removeChild(element);
	};
};

function handleFiles(element) {
	if (element.files.length === 0) {return false};
	file=element.files[0];
	
	if (file.type.startsWith('image/')){	
		var img = document.createElement("img");
    img.file = file;
		element.parentElement.appendChild(img);
		element.parentElement.classList.add('added');
	
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
		
		element.parentElement.parentElement.appendChild(makeNewUploadControl());
		return true;
	} 
	
	alert('File is not image file!!');
	return false

}

function handleColorPick(element, colorType) {	
	console.log(element.parentElement)
	var form = element.parentElement;
	var rightInput = form.elements[colorType];
	rightInput.value = element.value;
};

function sendGalleryUpdateToServer(gallery,element) {
	if (element.classList.contains("disabled")) {return false};
	element.classList.add("disabled");
	
	var formData = makeFormDataFromDom(gallery);
	var uri = "galleryupdateupload";
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open("POST", uri, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {return false};
		alert(xhr.response ? xhr.response.message : "Undefined Error");
		if (xhr.status == 200) {
			refreshSection(gallery,xhr.response.data);
		}
		element.classList.remove("disabled");
	};
	xhr.send(formData);
	
	function refreshSection (gallery, newData) {
		var section = document.getElementById('edit'+gallery);
		section.children[0].innerHTML = 'edit Gallery: ' + newData.displayTitle;
		
		var thumbNailArea = section.getElementsByClassName('thumbNailArea')[0];
		while (thumbNailArea.children.length > 0 ) {
			thumbNailArea.removeChild(thumbNailArea.firstElementChild);
		}
		
		for (var i = 0; i < newData.picture.length; i++){
			thumbNailArea.appendChild(makeNewThumbNail(newData.picture[i]));
		}
		thumbNailArea.appendChild(makeNewUploadControl());
		
	}
	
	function makeFormDataFromDom (gallery) {
		var fd = new FormData();
		
		var oldData = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'))[gallery];
		fd.append('title', oldData.title);
		fd.append('main', oldData.main);
		
		var form = document.getElementById("propertyForm"+gallery);
		fd.append('displayTitle', form.elements.displayTitle.value);
		fd.append('description', form.elements.description.value);
		fd.append('foreground', form.elements.foreground.value);
		fd.append('background', form.elements.background.value);
				
		var picturesToRemove = [];
		var deletedThumbCollection = document.getElementById('edit'+gallery).getElementsByClassName('deleted');
		for (var i=0; i<deletedThumbCollection.length; i++) {
			picturesToRemove.push(
				deletedThumbCollection[i].children[0].src.substring(deletedThumbCollection[i].children[0].src.lastIndexOf('/')+1)
			) ;
		};
		fd.append('picturesToRemove', picturesToRemove);
		
		var newThumbCollection = document.getElementById('edit'+gallery).getElementsByClassName('added');
		for (var i=0; i<newThumbCollection.length; i++) {
			fd.append('file_'+i, newThumbCollection[i].children[1].file);			
		};
				
		return fd;
	};
	
}

function makeNewUploadControl() {
	var newUploadControl = document.createElement('span');
	newUploadControl.setAttribute('class','thumbNail uploadControl');
	newUploadControl.setAttribute('onclick','handleUploadControlClick(this)');
	newUploadControl.innerHTML = "add picture";
	var newFileInput = document.createElement('input');
	newFileInput.setAttribute('class','hiddenFileInput');
	newFileInput.setAttribute('type','file');
	newFileInput.setAttribute('onchange','handleFiles(this)');
	newUploadControl.appendChild(newFileInput);
	return newUploadControl;
};

function makeNewThumbNail(source) {
	var newThumbNail = document.createElement('span');
	newThumbNail.setAttribute('class','thumbNail current');
	newThumbNail.setAttribute('onclick','handleThumbClick(this)');
	var newImg = document.createElement('img');
	newImg.setAttribute('src',source);
	newThumbNail.appendChild(newImg);
	return newThumbNail;	
}

handleSelect(0);