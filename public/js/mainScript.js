function toggleMenu(){
	var menuElement = document.getElementsByClassName('fromSide')[0];
	var currentValue = menuElement.style.top || 'intial';
	var hiddenValue = -menuElement.offsetHeight + 'px';
	menuElement.style.top = (currentValue !== '0px' ) ? '0px' : hiddenValue;
};