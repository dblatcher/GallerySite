document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));

function handleSelect(gallery) {
	var editSections = document.getElementsByClassName('editSection');
	for (i=0; i<editSections.length; i++) {
		editSections[i].style.display = 'none';
	}
	document.getElementById('edit'+gallery).style.display = 'block';
}

function handleThumbClick(element){
	element.classList.toggle('current');
	element.classList.toggle('deleted');	
}

function handleMainToggleClick(element) {
	
	var thumbClasses = element.parentElement.firstElementChild.classList;
	if (!( thumbClasses.contains('current') || thumbClasses.contains('added')  || thumbClasses.contains('deleted') )) 	
	{return false}; // if the thumbNail next to the toggle isn't current, added or deleted, it is the 'upload new file' control.
	
	
	var thumbNailArea = element.parentElement.parentElement;
	var mainToggleCollection = thumbNailArea.getElementsByClassName('mainImageToggle');
	for (i=0; i<mainToggleCollection.length; i++) {
		mainToggleCollection[i].classList.remove('toggled');
		mainToggleCollection[i].classList.add('untoggled');
	}
	element.classList.remove('untoggled');
	element.classList.add ('toggled');
}

function handleUploadControlClick(element){
	var input = element.getElementsByClassName('hiddenFileInput')[0];
	if (input.files.length === 0) {	
		input.click() // leads to handleFiles call if user selects a file.
	} else {
		element.parentElement.parentElement.removeChild(element.parentElement);
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
		
		element.parentElement.parentElement.parentElement.appendChild(makeNewUploadControl());
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
	
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open("POST", "galleryupdateupload", true);
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
			thumbNailArea.appendChild(makeNewThumbNail(newData.path,newData.picture[i]));
		}
		thumbNailArea.appendChild(makeNewUploadControl());
		
		var mainImage = thumbNailArea.getElementsByClassName('mainImageToggle')[newData.main];
		mainImage.classList.remove('untoggled');
		mainImage.classList.add ('toggled');
		
	}
	
	function makeFormDataFromDom (gallery) {
		var fd = new FormData();
		
		var oldData = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'))[gallery];
		fd.append('title', oldData.title);
		
		var editSection = document.getElementById('edit'+gallery);
		
		var form = document.getElementById("propertyForm"+gallery);
		fd.append('displayTitle', form.elements.displayTitle.value);
		fd.append('description', form.elements.description.value);
		fd.append('foreground', form.elements.foreground.value);
		fd.append('background', form.elements.background.value);
				
		var picturesToRemove = [];
		var deletedThumbCollection = editSection.getElementsByClassName('deleted');
		for (var i=0; i<deletedThumbCollection.length; i++) {
			picturesToRemove.push(
				deletedThumbCollection[i].children[0].src.substring(deletedThumbCollection[i].children[0].src.lastIndexOf('/')+1)
			) ;
		};
		fd.append('picturesToRemove', picturesToRemove);
		
		var newThumbCollection = editSection.getElementsByClassName('added');
		for (var i=0; i<newThumbCollection.length; i++) {
			fd.append('file_'+i, newThumbCollection[i].children[1].file);			
		};
		
		var mainImage = editSection.getElementsByClassName('toggled')[0].parentElement.firstElementChild.firstElementChild;
		mainImageFileName = mainImage.src.substring(mainImage.src.lastIndexOf('/')+1) 
		fd.append('nameOfMainImage',mainImageFileName);
		console.log(mainImageFileName);
		
		return fd;
	};
	
}

function makeNewUploadControl() {
	var newHolder = newThumbNailHolder();
	
	var newUploadControl = document.createElement('span');
	newUploadControl.setAttribute('class','thumbNail uploadControl');
	newUploadControl.setAttribute('onclick','handleUploadControlClick(this)');
	newUploadControl.innerHTML = "add picture";
	
	var newFileInput = document.createElement('input');
	newFileInput.setAttribute('class','hiddenFileInput');
	newFileInput.setAttribute('type','file');
	newFileInput.setAttribute('onchange','handleFiles(this)');
	
	newUploadControl.appendChild(newFileInput);
	newHolder.insertBefore(newUploadControl,newHolder.children[0]);
	return newHolder;
};

function makeNewThumbNail(galleryPath, pictureFileName) {
	var newHolder = newThumbNailHolder();
	
	var newThumbNail = document.createElement('span');
	newThumbNail.setAttribute('class','thumbNail current');
	newThumbNail.setAttribute('onclick','handleThumbClick(this)');
	
	var newImg = document.createElement('img');
	newImg.setAttribute('src','../' + galleryPath + pictureFileName );

	newThumbNail.appendChild(newImg);
	newHolder.insertBefore(newThumbNail,newHolder.children[0]);
	return newHolder;	
}

function newThumbNailHolder() {
	var newHolder = document.createElement('span');
	newHolder.setAttribute('class','thumbNailHolder');
	var newMainToggle = document.createElement('p');
	newMainToggle.innerHTML = 'main';
	newMainToggle.setAttribute('class','mainImageToggle untoggled');
	newMainToggle.setAttribute('onclick','handleMainToggleClick(this)');
	newHolder.appendChild(newMainToggle);
	return newHolder;	
}

handleSelect(0);