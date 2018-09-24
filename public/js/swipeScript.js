
//based on code from:
//http://gilmation.com/articles/javascript-event-delegation-for-a-horizontal-swipe-effect/


function addSwipeControls (targetElement,response) {
	
		var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
			touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
			direction = 'undefined',// Swipe direction
			minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
			maxDistanceYAxis = 30,// Max distance on mousemove or touchmove on the Y axis
			maxAllowedTime = 1000,// Max allowed time between swipeStart and swipeEnd
			startTime = 0,// Time on swipeStart
			elapsedTime = 0;// Elapsed time between swipeStart and swipeEnd
		
	function handleSwipe (swipeEventType) {
		if (typeof(response[swipeEventType]) == 'function') {
			response[swipeEventType]();
		};
	};	
		
		
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

	function addMultipleListeners(element, listOfEvents, handlingFunction) {
		var events = listOfEvents.split(' ');
		for (var i=0; i<events.length; i++) {
			element[events[i]] = handlingFunction;
		}
	}

	addMultipleListeners(targetElement, 'onmousedown ontouchstart', swipeStart);
	addMultipleListeners(targetElement, 'onmousemove ontouchmove', swipeMove);
	addMultipleListeners(targetElement, 'onmouseup ontouchend', swipeEnd);
	
};

