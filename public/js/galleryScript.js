
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

document.getElementsByTagName("HTML")[0].onclick = function() {
	var elements = document.getElementsByClassName("willFade");
	for (var i = 0; i<elements.length; i++) {
		elements[i].classList.remove("faded");
	};
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
	setTimeout(function() {fadeElementsOverlappingMainImage()},1500);
};

function findIndexOfImageShowing() {
	var images = [].slice.call(document.getElementsByClassName('mainImage'));
	for (var i=0; i< images.length; i++) {
		if ( images[i].classList.contains('showing') ) {return i};
	}
};

function adjustSizeOfImageToSuitScreen(pic) {
	if ( (pic.naturalWidth/ pic.naturalHeight) > (window.innerWidth / window.innerHeight) ) {
		pic.classList.add('widerThanScreen')
	} else {
		pic.classList.add('tallerThanScreen')
	};
};

function fadeElementsOverlappingMainImage() {
	var elements = document.getElementsByClassName("willFade");
	var image = document.getElementsByClassName('mainImage')[findIndexOfImageShowing()]
	
	for (var i = 0; i<elements.length; i++) {
		if (areOverlapping(image,elements[i])) {elements[i].classList.add("faded")};
	};
	
	function areOverlapping(element1, element2) {
		var rect1 = element1.getBoundingClientRect();	
		var rect2 = element2.getBoundingClientRect();

		return !(
		  rect1.top > rect2.bottom ||
		  rect1.right < rect2.left ||
		  rect1.bottom < rect2.top ||
		  rect1.left > rect2.right
		)	
	};
};

changeImageShowing(0);