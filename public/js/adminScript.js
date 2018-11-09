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
		input.click()
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
		
		var newUploadControl = document.createElement('span');
		newUploadControl.setAttribute('class','thumbNail uploadControl');
		newUploadControl.setAttribute('onclick','handleUploadControlClick(this)');
		newUploadControl.innerHTML = "add picture";
		var newFileInput = document.createElement('input');
		newFileInput.setAttribute('class','hiddenFileInput');
		newFileInput.setAttribute('type','file');
		newFileInput.setAttribute('onchange','handleFiles(this)');
		newUploadControl.appendChild(newFileInput);
		element.parentElement.parentElement.appendChild(newUploadControl);
		
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

function sendGalleryUpdateToServer(gallery) {
	var data = makeUpdatedGalleryObjectFromDom(gallery);
	
	var newThumbCollection = document.getElementById('edit'+gallery).getElementsByClassName('added');
	var picturesToAdd = [];
		
	for (var i=0; i<newThumbCollection.length; i++) {
		picturesToAdd.push(newThumbCollection[i].children[1].file);
	};
	
	new postFilesAndData(picturesToAdd,data);
	
	function makeUpdatedGalleryObjectFromDom (gallery) {
		var data = JSON.parse(document.getElementById('dataHolder').getAttribute('originalData'))[gallery];
		var form = document.getElementById("propertyForm"+gallery);
		
		data.displayTitle = form.elements.displayTitle.value;
		data.description = form.elements.description.value;
		data.foreground = form.elements.foreground.value;
		data.background = form.elements.background.value;
		
		var deletedThumbCollection = document.getElementById('edit'+gallery).getElementsByClassName('deleted');
		
		var picToDelete;
		for (var i=0; i<deletedThumbCollection.length; i++) {
			picToDelete = deletedThumbCollection[i].children[0].src;
			picToDelete = picToDelete.substring(picToDelete.lastIndexOf('/')+1);	
			for (var j=0; j<data.picture.length; j++) {
				if (data.picture[j] === picToDelete) {data.picture.splice(j,1);};
			};
		};
		
		return data;
	};
	
	function postFilesAndData(files,data) {
		var uri = "galleryupdateupload";
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		
		xhr.open("POST", uri, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log(xhr.responseText); // handle response.
			}
		};
		
		for (var i=0; i<files.length; i++) {
			fd.append('file_'+i, files[i]);			
		}; 

		fd.append('displayTitle', data.displayTitle);
		fd.append('description', data.description);
		fd.append('foreground', data.foreground);
		fd.append('background', data.background);
		fd.append('picture', data.picture);
				
		xhr.send(fd);
	}
	
}


handleSelect(0);