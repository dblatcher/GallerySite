
//based on code from:
//http://gilmation.com/articles/javascript-event-delegation-for-a-horizontal-swipe-effect/

// add this script generic before the page's main script
// add the ID of the targetElement below
// define the handleSwipe function in the main script :

/* 

function handleSwipe (swipeHappen) {
	switch(swipeHappen){
    case 'left':
		
		
    break;
	case 'right':

		
    break;		
	case 'start':

		
    break;
	}
}

*/

var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
    touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
    direction = 'undefined',// Swipe direction
    minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
    maxDistanceYAxis = 30,// Max distance on mousemove or touchmove on the Y axis
    maxAllowedTime = 1000,// Max allowed time between swipeStart and swipeEnd
    startTime = 0,// Time on swipeStart
    elapsedTime = 0,// Elapsed time between swipeStart and swipeEnd
	
    targetElement = document.getElementById('framer');// Element to delegate

	
function swipeStart(e) {
  e = e ? e : window.event;
  e = ('changedTouches' in e)?e.changedTouches[0] : e;
  touchStartCoords = {'x':e.pageX, 'y':e.pageY};
  startTime = new Date().getTime();
  handleSwipe('start');
}

function swipeMove(e){
  e = e ? e : window.event;
  e.preventDefault();
}

function swipeEnd(e) {
  e = e ? e : window.event;
  e = ('changedTouches' in e)?e.changedTouches[0] : e;
  touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
  elapsedTime = new Date().getTime() - startTime;
  if (elapsedTime <= maxAllowedTime){
    if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
      direction = (touchEndCoords.x < 0)? 'left' : 'right';
      
	  handleSwipe(direction);
	  
    }
  }
}

function addMultipleListeners(el, s, fn) {
  var evts = s.split(' ');
  for (var i=0, iLen=evts.length; i<iLen; i++) {
    el.addEventListener(evts[i], fn, false);
  }
}

addMultipleListeners(targetElement, 'mousedown touchstart', swipeStart);
addMultipleListeners(targetElement, 'mousemove touchmove', swipeMove);
addMultipleListeners(targetElement, 'mouseup touchend', swipeEnd);