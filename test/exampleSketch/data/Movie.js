
	var Movie = this.Movie = (function(){
		
		/*
		Movie(parent, filename/url)
		Movie(parent, filename/url, fps)
		*/
		var MovieImpl = function () {
			
			if ( arguments.length < 2 )
				throw("Movie() expects more arguments, "+arguments.length+" given.");
			
			// handle passed arguments
			
			var parent = arguments[0];
			var urls = [];
			if (arguments[1] instanceof Array) urls = arguments[1];
			else {
				var u = arguments[1].split(";");
				for ( var i in u ) urls.push(u[i]);
			}
			var fps = parseInt(arguments[2]);
			
			/**
			 *	PRIVATE VARS, FUNCTIONS
			 */
			
			var doLoop = false, newFrameAvailable = false;

			var videoElement = null;
			var canvasElement = null, canvasContext = null;
			var mediaLoaded = false;
			var playOnLoad = false;
			var movieEventFn = null;

			function loadMovie () {
					// https://developer.mozilla.org/en/HTML/Element/video
					// https://developer.mozilla.org/en/DOM/HTMLMediaElement
					videoElement = document.createElement('video');
					//videoElement.width = '1';
					//videoElement.height = '1';
					//videoElement.controls = 'controls';
					videoElement.preload = 'auto';
					videoElement.autoplay = undefined;
					for ( var i = 0; i < urls.length; i++ ) {
						var src = document.createElement('source');
						src.src = urls[i];
						videoElement.appendChild(src);
					}
					
					function handleOnLoad () {
						if ( mediaLoaded ) return;
						mediaLoaded = true;
						videoElement.width  = __self__.width = videoElement.videoWidth;
						videoElement.height = __self__.height = videoElement.videoHeight;
						/*canvasElement = document.createElement('canvas');
						canvasElement.width  = videoElement.videoWidth;
						canvasElement.height = videoElement.videoHeight;
						canvasContext = canvasElement.getContext('2d');
						document.body.appendChild(canvasElement);*/
						
						// treat this as first frame
						newFrameAvailable = true;
						__self__.read();
						
						if ( playOnLoad ) videoElement.play();
					}
					bindEvent(videoElement, 'canplaythrough', handleOnLoad);
					bindEvent(videoElement, 'load', handleOnLoad);
					
					bindEvent(videoElement, 'ended', function () {
						if ( doLoop ) {
							videoElement.currentTime = 0.001; /*Webkit fix: http://bit.ly/kMNikb*/
							videoElement.play();
						}
					});
					
					bindEvent(videoElement, 'timeupdate', function () {
						newFrameAvailable = true;
						triggerMovieEvent();
					});
					
					// Safari won't load it if it's not on the page
					videoElement.style = videoElement.style || {};
					videoElement.style.position = "absolute";
					videoElement.style.top  = "-1000px";
					videoElement.style.left = "-1000px";
					document.body.appendChild(videoElement);
			}

			function setMovieEventListener ( listener ) {
				if ( typeof listener == 'object' 
					 && 'movieEvent' in listener
					 && typeof listener['movieEvent'] == 'function' ) {
						movieEventFn = function(){
							listener['movieEvent'].call(listener, __self__);
						};
					}
			}

			function triggerMovieEvent () {
				if ( movieEventFn !== null ) {
					movieEventFn.call();
				}
			}

			function ensureVideoElement () {
				return videoElement !== null && videoElement.readyState > 0;
			}
			
			function bindEvent ( element, eventType, eventHandler, bubbleUp ) {
				if (element.addEventListener){
					element.addEventListener(eventType, eventHandler, (bubbleUp || false)); 
				} else if (element.attachEvent){
					element.attachEvent('on'+eventType, eventHandler);
				}
			}
			
			/**
			 *	 PUBLIC API
			 */

			this.width = 0;
			this.height = 0;
			
			// Reads the current frame from the movie
			// http://processing.org/reference/libraries/video/Movie_read_.html
			this.read = function () {
				if ( /*canvasContext == null ||*/ !ensureVideoElement() ) return null;
				//canvasContext.drawImage(videoElement,0,0);
				this.sourceImg = videoElement; //canvasContext.getImageData(0,0,canvasElement.width,canvasElement.height);
				return this;
			};
			
			// Returns true when a new frame is available
			// http://processing.org/reference/libraries/video/Movie_available_.html
			this.available = function () {
				return ensureVideoElement() && newFrameAvailable;
			};
			
			// Plays the movie once
			// http://processing.org/reference/libraries/video/Movie_play_.html
			this.play = function () {
				if ( ensureVideoElement() ) videoElement.play();
				else playOnLoad = true;
			};
			
			// Pauses the movie playback
			// http://processing.org/reference/libraries/video/Movie_pause_.html
			this.pause = function () {
				if ( ensureVideoElement() ) videoElement.pause();
				else playOnLoad = false;
			};
			
			// Stops the movie playback
			// http://processing.org/reference/libraries/video/Movie_stop_.html
			this.stop = function () {
				if ( ensureVideoElement() ) {
					videoElement.pause();
					videoElement.currentTime = 0;
				} else {
					playOnLoad = false;
				}
			};
			
			// Plays the movie continuously
			// http://processing.org/reference/libraries/video/Movie_loop_.html
			this.loop = function () {
				doLoop = true;
			};
			
			// Stops the movie from looping
			// http://processing.org/reference/libraries/video/Movie_noLoop_.html
			this.noLoop = function () {
				doLoop = false;
			};
			
			// 	Jumps to a specific location in the movie
			// http://processing.org/reference/libraries/video/Movie_jump_.html
			this.jump = function ( sec ) {
				if ( parseFloat(sec) === 0 ) sec = 0.001; /*Webkit fix: http://bit.ly/kMNikb*/
				if ( ensureVideoElement() ) videoElement.currentTime = sec;
			};
			
			// Returns the total length of the movie
			// http://processing.org/reference/libraries/video/Movie_duration_.html
			this.duration = function () {
				return ensureVideoElement() ? videoElement.duration : 0;
			};
			
			// Returns the current playback position
			// http://processing.org/reference/libraries/video/Movie_time_.html
			this.time = function () {
				return ensureVideoElement() ? videoElement.currentTime : -1;
			};
			
			// Sets a multiplier for how fast/slow a movie should play
			// http://processing.org/reference/libraries/video/Movie_speed_.html
			this.speed = function ( speed ) {
				if ( ensureVideoElement() ) videoElement.playbackRate = speed;
			};
			
			// Sets how often new frames are read from the movie
			// http://processing.org/reference/libraries/video/Movie_frameRate_.html
			this.frameRate = function ( fps ) {
				// not sure how to do this as <video> does not give original fps
			};
			
			// let's get started
			
			this.sourceImg = {}; // trick Processing.js into using fastImage
			
			var __self__ = this;
			loadMovie();
			setMovieEventListener(parent);
		};
		
		return MovieImpl;
		
	})();
	
	// This let's Processing/Java code legally call Movie with it's
	// full namespace.
	var processing = this.processing = processing || {};
	processing.video = processing.video || {};
	processing.video.Movie = Movie;
	