document.getElementById('dataHolder').data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'));

fillThumbnailSectionsUsingInitialData();
handleGallerySelectClick(0);

function handleGallerySelectClick(gallery) {
	var editSections = document.getElementsByClassName('editSection');
	for (i=0; i<editSections.length; i++) {
		editSections[i].style.display = 'none';
	}
	document.getElementById('edit'+gallery).style.display = 'block';
}

function handleExistingThumbClick(element){
	element.parentElement.classList.toggle('current');
	element.parentElement.classList.toggle('deleted');	
}

function handleMainToggleClick(element) {
	
	var thumbHolderClasses = element.parentElement.classList;
	if (!( thumbHolderClasses.contains('current') || thumbHolderClasses.contains('added') )) 	
	{return false}; 
	// only current or added images should be set to main

	
	var thumbNailArea = element.parentElement.parentElement;
	var holderCollection = thumbNailArea.getElementsByClassName('thumbNailHolder');
	for (i=0; i<holderCollection.length; i++) {
		holderCollection[i].classList.remove('mainPic');
		holderCollection[i].classList.add('notMainPic');
	}
	element.parentElement.classList.remove('notMainPic');
	element.parentElement.classList.add ('mainPic');
}

function handleNewThumbClick(element){
	var input = element.parentElement.getElementsByClassName('hiddenFileInput')[0];
	if (input.files.length === 0) {	
		input.click() // leads to handleFiles call if user selects a file.
	} else {
		element.parentElement.parentElement.removeChild(element.parentElement);
	};
};

function handleShiftButtonClick (element,direction) {
	var holder = element.parentElement.parentElement;
	var holderCollection = holder.parentElement.getElementsByClassName('thumbNailHolder');
	
	var index;
	for (var i = 0; i < holderCollection.length; i++) {
		if (holderCollection[i] === holder ) {index = i; break}
	}
	
	if (direction == 'left') {
		if (index > 0) {
			holder.parentElement.insertBefore(holder,holder.parentElement.children[index-1]);
		};
	};
	
	if (direction == 'right') {
		if (index < holderCollection.length-2) {
			holder.parentElement.insertBefore(holder,holder.parentElement.children[index+2]);
		};
	};
	
}

function handleSwapButtonClick(element) {
	var holder = element.parentElement.parentElement;
	var parent = holder.parentElement;
	var holderCollection = parent.getElementsByClassName('thumbNailHolder');
	var indexClicked, indexSwapping = -1,swappingHolder;
	
	
	if (holder.classList.contains('swapping')) {
		holder.classList.remove('swapping');
		return
	}
	
	for (var i = 0; i < holderCollection.length; i++) {
		if (holderCollection[i] === holder ) {indexClicked = i;}
		if (holderCollection[i].classList.contains('swapping') ) {indexSwapping = i; swappingHolder = holderCollection[i]}
	}
	
	if (indexSwapping == -1) {
		holder.classList.add('swapping');
		return
	}
	

	swappingHolder.classList.remove('swapping');

	swappingHolder = parent.replaceChild(holder,swappingHolder)
	parent.insertBefore(swappingHolder,holderCollection[indexClicked]);
	
	

}


function handleFiles(element) {
	if (element.files.length === 0) {return false};
	file=element.files[0];
	
	if (file.type.indexOf('image/')==0){	
		var img = document.createElement("img");
    img.file = file;
		
		var thumbNailSibling = element.parentElement.getElementsByClassName('thumbNail')[0]
		thumbNailSibling.appendChild(img);
		element.parentElement.classList.add('added');
		element.parentElement.classList.remove('uploadControl');
	
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
		
		element.parentElement.parentElement.appendChild(makeNewUploadControl());
		return true;
	} 
	
	alert('File is not image file!!');
	element.parentElement.parentElement.appendChild(makeNewUploadControl());
	element.parentElement.parentElement.removeChild(element.parentElement);
	
	return false

}

function handleColorPick(element, colorType) {	
	var form = element.parentElement.parentElement;
	var rightInput = form.elements[colorType];
	rightInput.value = element.value;
};

function sendGalleryUpdateToServer(gallery,element) {
	if (element.classList.contains("disabled")) {return false};
	element.classList.add("disabled");
	var formData = makeFormDataFromDom(gallery);	
	
	var xhr = new XMLHttpRequest();
	//xhr.responseType = 'json';
	xhr.open("POST", "galleryupdateupload", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {return false};
		
		console.log(xhr.response);
		alert(xhr.response ? JSON.parse(xhr.response).message : "Undefined Error");
		if (xhr.status == 200) {
			
			if (gallery !== "New") {
				refreshSection(gallery,JSON.parse(xhr.response).data);
			}
		}
		element.classList.remove("disabled");
	};
	xhr.send(formData);
		
	function makeFormDataFromDom (gallery) {
		var srcString, fileInputSibling,picturesToRemove = [], picturesInOrder = [];
		var editSection = document.getElementById('edit'+gallery);
		var fd = new FormData();
		var form = document.getElementById("propertyForm"+gallery);
		
		
		if (gallery === "New") {
			fd.append('title', form.elements.title.value);
			fd.append('isNewGallery', 'true');			
		} else {
			fd.append('title', document.getElementById('dataHolder').data[gallery].title);
			fd.append('isNewGallery', 'false');
		}
		
		fd.append('displayTitle', form.elements.displayTitle.value);
		fd.append('description', form.elements.description.value);
		fd.append('foreground', form.elements.foreground.value);
		fd.append('background', form.elements.background.value);
		
		var holderCollection = editSection.getElementsByClassName('thumbNailHolder');
		for (var i=0; i<holderCollection.length; i++) {
			srcString = "";
					
			if (holderCollection[i].classList.contains('current')) {
				srcString = holderCollection[i].getElementsByTagName('img')[0].src;
				srcString = srcString.substring(srcString.lastIndexOf('/')+1);
				picturesInOrder.push(srcString);
			};
			
			if (holderCollection[i].classList.contains('deleted')) {
				srcString = holderCollection[i].getElementsByTagName('img')[0].src;
				srcString = srcString.substring(srcString.lastIndexOf('/')+1);
				picturesToRemove.push(srcString);	
			};
			
			if (holderCollection[i].classList.contains('added')) {
				fileInputSibling = holderCollection[i].getElementsByClassName('hiddenFileInput')[0]
				srcString = fileInputSibling.files[0].name;
				fd.append('file_'+i, fileInputSibling.files[0]);
				picturesInOrder.push(srcString);
			};
			
			if (holderCollection[i].classList.contains('mainPic')) {
				fd.append('nameOfMainImage',srcString);
			};
			
		};
		
		fd.append('picturesToRemove', picturesToRemove);
		fd.append('picturesInOrder', picturesInOrder);
		
		return fd;
	};
	
}


function fillThumbnailSectionsUsingInitialData(){
	var data = document.getElementById('dataHolder').data;
	for (var i = 0; i < data.length; i++ ) {
		refreshSection(i, data[i]);
	};
	
	var thumbNailArea = document.getElementById('editNew').getElementsByClassName('thumbNailArea')[0];
	thumbNailArea.appendChild(makeNewUploadControl());
};

function refreshSection (gallery, newData) {
	newData.main = newData.main || 0;
	var section = document.getElementById('edit'+gallery);
	
	section.getElementsByClassName('sectionHeading')[0].innerHTML = 'edit Gallery: ' + newData.title;
	section.getElementsByClassName('updateButton')[0].innerHTML = 'Save changes to ' + newData.displayTitle;
	
	var thumbNailArea = section.getElementsByClassName('thumbNailArea')[0];
	while (thumbNailArea.children.length > 0 ) {
		thumbNailArea.removeChild(thumbNailArea.firstElementChild);
	}
	for (var i = 0; i < newData.picture.length; i++){
		thumbNailArea.appendChild(makeNewThumbNail(newData.path,newData.picture[i], newData.main===i));
	}
	thumbNailArea.appendChild(makeNewUploadControl());
	
}


function makeNewUploadControl() {
	var newHolder = newThumbNailHolder(false,true);
	
	var newThumbNail = document.createElement('span');
	newThumbNail.setAttribute('class','thumbNail');
	newThumbNail.setAttribute('onclick','handleNewThumbClick(this)');
	newThumbNail.innerHTML = "add picture";
	
	var newFileInput = document.createElement('input');
	newFileInput.setAttribute('class','hiddenFileInput');
	newFileInput.setAttribute('type','file');
	newFileInput.setAttribute('onchange','handleFiles(this)');
	
	newHolder.insertBefore(newThumbNail,newHolder.children[0]);
	newHolder.appendChild(newFileInput);
	return newHolder;
};

function makeNewThumbNail(galleryPath, pictureFileName,isMain) {
	var newHolder = newThumbNailHolder(isMain,false);
	
	var newThumbNail = document.createElement('span');
	newThumbNail.setAttribute('class','thumbNail');
	newThumbNail.setAttribute('onclick','handleExistingThumbClick(this)');
	
	var newImg = document.createElement('img');
	newImg.setAttribute('src','../' + galleryPath + pictureFileName );
	newThumbNail.appendChild(newImg);
	
	newHolder.insertBefore(newThumbNail,newHolder.children[0]);
	return newHolder;	
}

function newThumbNailHolder(isMain, isUploader) {
	var holderClasses = "thumbNailHolder";
	if (isUploader) {holderClasses += " uploadControl"} else {holderClasses += " current"}
	if (isMain) {holderClasses += " mainPic"} else {holderClasses += " notMainPic"}
	
	var newHolder = document.createElement('div');
	newHolder.setAttribute('class',holderClasses);
	var newMainToggle = document.createElement('div');
	newMainToggle.innerHTML = 'main';
	newMainToggle.setAttribute('class','mainImageToggle');
	newMainToggle.setAttribute('onclick','handleMainToggleClick(this)');
	newHolder.appendChild(newMainToggle);
	
	var moveControl = document.createElement('div');
		moveControl.setAttribute('class','moveControl');
	
	var moveleft = document.createElement('div');
		moveleft.setAttribute('class','moveButton moveButtonBack');
		moveleft.innerHTML = '&#8592;';
		moveleft.setAttribute('onclick','handleShiftButtonClick(this,"left")');

	var moveswap = document.createElement('span');
		moveswap.innerHTML = ' &#8645; ';
		moveswap.setAttribute('onclick','handleSwapButtonClick(this)');
		moveswap.setAttribute('class','swapButton');
		
	var moveright = document.createElement('div');
		moveright.setAttribute('class','moveButton moveButtonForward');
		moveright.innerHTML = '&#8594;';
		moveright.setAttribute('onclick','handleShiftButtonClick(this,"right")');
		
		
	moveControl.appendChild(moveleft);
	moveControl.appendChild(moveswap);
	moveControl.appendChild(moveright);
	
	newHolder.appendChild(moveControl);
	
	return newHolder;	
}

