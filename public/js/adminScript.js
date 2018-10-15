
function handleSelect(gallery) {
	var section = document.getElementsByClassName('editSection');
	for (i=0; i<section.length; i++) {
		section[i].style.display = 'none';
	}
	document.getElementById('edit'+gallery).style.display = 'block';
}

function handleThumbClick(gallery,picture){
	var thumbCollection = document.getElementById('edit'+gallery).getElementsByClassName('thumbNail');	
	var thumbElement;
	for (i=0;i<thumbCollection.length;i++) {
		if (thumbCollection[i].getAttribute('pictureIndex') == picture) {thumbElement = thumbCollection[i]}
	};
	
	thumbElement.classList.toggle('current');
	thumbElement.classList.toggle('deleted');
	
}

function handleUploadControl(gallery){
	document.getElementById('chooseNewFile'+gallery).click();
};

function handleFiles(files,gallery) {
	if (files.length === 0) {return false};
	file=files[0]
	console.log(file);
	console.log(gallery);
	
	if (file.type.startsWith('image/')){
		var thumbsContainer = document.getElementById('edit'+gallery).getElementsByClassName('thumbs')[0];
		
		var newThumb = document.createElement('span');
		newThumb.classList.add('thumbNail');
		newThumb.classList.add('added');
    newThumb.onclick = function() {			
			this.parentElement.removeChild(this);
		}
		
		var img = document.createElement("img");
    img.file = file;
		newThumb.appendChild(img);
		
		
		thumbsContainer.appendChild(newThumb);
    
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);

	} else {
		alert('File is not image file!!');
	}	
}

function handleColorPick(gallery,colorValue,colorType) {	
	var formContents = document.getElementById('propertyForm'+gallery).children;
	var rightInput;
	for (i=0;i<formContents.length;i++) {
		if (formContents[i].getAttribute('name') == colorType) {rightInput = formContents[i]}
	};
	rightInput.value = colorValue;
	
};

//handleSelect("New");
handleSelect(0);