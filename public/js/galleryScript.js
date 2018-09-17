
document.getElementById("forwardButton").onclick = function() {
	changeImageShowing(findIndexOfImageShowing()+1);
};

document.getElementById("backButton").onclick = function() {
	changeImageShowing(findIndexOfImageShowing()-1)
};

document.getElementsByTagName("BODY")[0].onresize = function() {
	var i = findIndexOfImageShowing();
	if (i){
		var image = document.getElementsByClassName('mainImage')[i];
		adjustSizeOfImageToSuitScreen(image);
	}
};

function changeImageShowing(chosenImage) {
	var images = [].slice.call(document.getElementsByClassName('mainImage'));
	images.forEach ( (image) => { 
		image.classList.remove('showing');
		image.classList.remove('widerThanScreen');
		image.classList.remove('tallerThanScreen');
	});
	while (chosenImage >= images.length) {chosenImage -= images.length;};
	while (chosenImage < 0) {chosenImage += images.length;};
	images[chosenImage].classList.add('showing');
	adjustSizeOfImageToSuitScreen(images[chosenImage]);
};

function findIndexOfImageShowing() {
	var images = [].slice.call(document.getElementsByClassName('mainImage'));
	for (var i=0; i< images.length; i++) {
		if ( images[i].classList.contains('showing') ) {return i};
	}
}

function adjustSizeOfImageToSuitScreen(pic) {
	if ( (pic.naturalWidth/ pic.naturalHeight) > (window.innerWidth / window.innerHeight) ) {
		pic.classList.add('widerThanScreen')
	} else {
		pic.classList.add('tallerThanScreen')
	};
}


changeImageShowing(0);