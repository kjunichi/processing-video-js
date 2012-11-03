/**
 *  A Movie class for Processing.js and <canvas> 
 *  that mimics Processing's video library
 *
 *  https://github.com/fjenett/processing-video-js
 *
 *  See Java video library documentation:
 *  http://processing.org/reference/libraries/video/index.html
 *  
 *  fjenett - 2012
 */

var Movie = (function(window,document){

    /* + + + + + + + + + + + + + + + + + + +
     +
     +  Class Movie
     +
     +  http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(HTML5_Media)
     +  
     +  https://developer.mozilla.org/en/DOM/HTMLVideoElement
     +  https://developer.mozilla.org/en/DOM/HTMLMediaElement
     +  https://developer-new.mozilla.org/en-US/docs/DOM/Media_events
     +  
     +  https://developer.mozilla.org/En/Manipulating_video_using_canvas
     +  http://www.html5videoguide.net/presentations/HTML5_Video_LCA2011/
     +
     + + + + + + + + + + + + + + + + + + + */

        var Movie = function () {

        /* + + + + + + + + + + + + + + + + + + +
         +  Private methods
         + + + + + + + + + + + + + + + + + + + */

        var callListeners = function (meth, args) {
            for ( var i = 0, k = listeners.length; i < k; i++ ) {
                if ( meth in listeners[i] ) {
                    listeners[i][meth].apply(listeners[i],args);
                }
            }
        }

        var addVideoEventListeners = function () {

            // var events = ['abort', 'canplay', 'canplaythrough', 'durationchange', 
            // 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 
            // 'loadstart', 'mozaudioavailable', 'pause', 'play', 'playing', 
            // 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 
            // 'volumechange', 'waiting'];

            // for ( var i = 0; i < events.length; i++ ) {
            //     var fnName = "on"+events[i][0].toUpperCase()+events[i].substring(1);
            //     try {
            //         var fn = eval(fnName);
            //         element.addEventListener(events[i],fn);
            //     } catch (e) {
            //         // ignore
            //     }
            // }

            // otherwise Google closure compiler "optimizes" the functions away ..
            element.addEventListener('error',           onError);
            element.addEventListener('loadedmetadata',  onLoadedmetadata);
            element.addEventListener('timeupdate',      onTimeupdate);
            element.addEventListener('canplay',         onCanplay);
        }

        var onError = function (evt) {
            var errMsg = "";
            switch ( element.networkState ) {
                case element.NETWORK_EMPTY:
                    errMsg = "Loading did not start yet."; break;
                case element.NETWORK_IDLE:
                    errMsg = "Loading did not start yet."; break;
                case element.NETWORK_LOADING:
                    errMsg = "Loading has not finished yet."; break;
                case element.NETWORK_NO_SOURCE:
                    errMsg = "The source provided is missing. "+element.src; break;
                default:
                    errMsg = "Not sure what happened ... care to report it to fjenett@gmail.com ?";
            }
            alert(errMsg);
        }

        var onLoadedmetadata = function (evt) {
            element.setAttribute('width',element.videoWidth);
            element.setAttribute('height',element.videoHeight);
            fpsToSeconds = 1000.0/element.fps;

            if ( !sketch ) {
                initCanvas();
            }
        }

        var initCanvas = function () {
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', element.videoWidth);
            canvas.setAttribute('height', element.videoHeight);
            context2d = canvas.getContext('2d');
        }

        var onCanplay = function (evt) {
            if ( !posterImage )
                movie.read();

            if ( !sketch && !context2d )
                initCanvas();

            // TODO: add a way for people to tap into loaded event
            //callListeners( 'canPlay',[movie] );
        }

        var onTimeupdate = function (evt) {
            if ( shouldLoop && isChrome ) {
                if ( element.currentTime === element.duration ) {
                    element.addEventListener('canplay',function(){
                        element.playbackRate = playbackRate;
                        element.volume = volume;
                        element.play();
                        startPolling();
                    });
                    stopPolling();
                    element.src = element.currentSrc;
                }
            }
        }

        var startPolling = function () {
            if ( !sketch && !context2d )
                initCanvas();

            var doPoll = function () {
                if ( element.readyState < 3 ) {
                    isAvailable = false;
                } else {
                    var now = element.currentTime;
                    isAvailable = lastTime !== now;
                    if ( isAvailable ) {
                        callListeners('movieEvent',[movie]);
                    }
                    lastTime = now;
                }
                pollerTs = setTimeout( doPoll, 1000/fps );
            }
            doPoll();
        }

        var stopPolling = function () {
            clearTimeout(pollerTs);
        }

        /* + + + + + + + + + + + + + + + + + + +
         +  Private variables
         + + + + + + + + + + + + + + + + + + + */

        var isChrome;

        var listeners = [];
        var sketch, canvas, context2d;
        var element, movie, frame;
        var directToImage = false;

        var posterImage;

        var shouldLoop = false;
        var playbackRate = 1;
        var volume;

        var isAvailable = false;
        var lastTime = -1, pollerTs = -1;
        var fpsToSeconds;

        var fps = 25.0;

        /* + + + + + + + + + + + + + + + + + + +
         +  Constructor
         + + + + + + + + + + + + + + + + + + + */

        var init = function () {
            var opts = {};
            
            if ( arguments.length == 1 && typeof arguments[0] == 'object' ) {
                opts = arguments[0];
            } else if (arguments.length >= 2) {
                var args = Array.prototype.slice.call(arguments);
                // var-args assumes: listener, src1, src2, …, srcN
                var l = args.shift();
                opts = {
                    sources: args,
                    listener: l
                };
            } else {
                throw('Wrong number of args passed to Movie()!');
            }

            element = opts.element;
            if ( !opts.element && opts.sources ) {
                element = document.createElement('video');
                element.setAttribute( 'crossorigin', 'anonymous' );
                //element.setAttribute( 'poster', 'poster.gif' );
                //element.setAttribute( 'controls', 'controls' );
                //element.setAttribute( 'src', opts.src );
                for ( var i = 0, k = opts.sources.length; i < k; i++ ) {
                    var source = document.createElement('source');
                    source.setAttribute('src', opts.sources[i]);
                    element.appendChild(source);
                }
                var container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-10000px';
                container.style.top = '-10000px';
                container.appendChild( element );
                document.body.appendChild( container );
            }

            shouldLoop = ('loop' in element) ? true : false;

            if ( ('poster' in element && element.poster) || opts.poster ) {
                posterImage = new Image();
                posterImage.onload = function () {
                    if ( element.paused ) {
                        if ( sketch ) {
                            frame = new sketch.PImage();
                            frame.fromHTMLImageData( posterImage );
                        } else {
                            frame.src = posterImage;
                        }
                    }
                }
                posterImage.src = element.poster;
            }
            
            listeners = [];
            if ( opts.listener )
            {
                listeners.push(opts.listener);
                if ( 'Processing' in window && Processing && opts.listener instanceof Processing ) {
                    sketch = opts.listener;
                    frame = new sketch.PImage();
                }
            }
            if ( opts.image && 'src' in opts.image ) {
                frame = opts.image;
                if ( !opts.listener ) {
                    listeners.push({
                        movieEvent: function (movie) {
                            movie.read();
                        }
                    });
                }
            } 
            if ( !frame ) {
                frame = new Image();
            }
                
            addVideoEventListeners();

            // element.addEventListener('canplay',function(evt){
            //     if ( !('autoplay' in element ? element.autoplay : false) ) element.pause();
            //     element.removeEventListener( this );
            // });
            // element.play();

            isChrome = window.navigator.appVersion.toLowerCase().indexOf('chrome') >= 0;

            movie = this;
        }

        init.apply( this, arguments );

        /* + + + + + + + + + + + + + + + + + + +
         +  Public methods
         + + + + + + + + + + + + + + + + + + + */

        /*  */
        this.setSourceFrameRate = function ( frameRate ) {
            fps = frameRate;
        };
        /*  */
        this.getElement = function () {
            return element;
        };
        /* sets the volume */
        this.volume = function ( vol ) {
            element.volume = vol;
            volume = vol;
        };
        /* Reads the current frame of the movie. */
        this.read = function () {
            if ( sketch ) {
                if (!frame) frame = new sketch.PImage;
                try {
                    frame.fromHTMLImageData(element);
                    //frame.isRemote = false;
                } catch (e) {
                    //console.log(e);
                    throw(e);
                }
            } else if ( context2d ) {
                context2d.drawImage(element,0,0);
                frame.src = canvas.toDataURL();
            } else {
                throw( 'unable to read() no target given' );
            }
            return frame;
        };
        /* Returns "true" when a new movie frame is available to read. */
        this.available = function () {
            return isAvailable;
        };
        /* Play the movie */
        this.play = function () {
            element.play();
            startPolling();
        };
        this.isPlaying = function () {
            return !element.paused;
        };
        /* Pause the movie */
        this.pause = function () {
            element.pause();
            stopPolling();
        };
        this.isPaused = function () {
            return element.paused;
        };
        /* Stop the movie */
        this.stop = function () {
            element.pause();
            stopPolling();
        };
        /* Set loop attribute */
        this.loop = function () {
          shouldLoop = true;
          element.setAttribute('loop','loop');
        };
        /* Set loop attribute */
        this.noLoop = function () {
          shouldLoop = false;
          element.removeAttribute('loop');
        };
        this.isLooping = function () {
          return shouldLoop;
        };
        /* Jump to a specific second (from float) in the video */
        this.jump = function ( seconds ) {
            element.currentTime = seconds;
        };
        /* Return duration in seconds with frac (as float) */
        this.duration = function () {
            return element.duration;
        };
        /* Return video current time as seconds with frac (as float) */
        this.time = function () {
            return element.currentTime;
        };
        /* Set playback speed to be scaled by given value (as float) */
        this.speed = function ( rate ) {
            if ( rate !== 0.0 )
            {
                element.playbackRate = rate;
                playbackRate = rate;
            }
            else
            {
                element.pause();
            }
        };
        /* Set the frame rate of the movie in fps */
        this.frameRate = function ( rate ) {
            // can't as we can not get the fps from the movie ... ideas?
            //throw( 'Please use speed() instead' );
            this.speed( rate / fps );
        };
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* GSVideo? */
        this.getSourceFrameRate = function () {
            //throw( 'This is not available for web video' );
            return fps;
        };
        /* GSVideo? */
        this.goToBeginning = function () {
            this.jump(0);
        };
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* Java? */
        this.dispose = function () {
            this.stop();
            document.body.removeChild(element);
            delete element;
        };
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* ? */
        this.ready = function () {
            return element.readyState > 2;
        };
        /* ? */
        this.newFrame = function () {
            return this.available();
        };
        /* ? */
        this.getFilename = function () {
            return element.currentSrc;
        };
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* PImage inheritance */
        /* http://processing.org/reference/PImage.html */
        /* PImage.get */
        this.get = function () {
            return frame.get.apply(frame,arguments);
        };
        /* PImage.set */
        this.set = function () {
            return frame.set.apply(frame,arguments);
        };
        /* PImage.copy */
        this.copy = function () {
            return frame.copy.apply(frame,arguments);
        };
        /* PImage.mask */
        this.mask = function () {
            return frame.mask.apply(frame,arguments);
        };
        /* PImage.blend */
        this.blend = function () {
            return frame.blend.apply(frame,arguments);
        };
        /* PImage.filter */
        this.filter = function () {
            return frame.filter.apply(frame,arguments);
        };
        /* PImage.save */
        this.save = function () {
            return frame.save.apply(frame,arguments);
        };
        /* PImage.resize */
        this.resize = function (){
            return frame.resize.apply(frame,arguments);
        };
        /* PImage.loadPixels */
        this.loadPixels = function () {
            return frame.loadPixels.apply(frame,arguments);
        };
        /* PImage.updatePixels */
        this.updatePixels = function () {
            return frame.updatePixels.apply(frame,arguments);
        };
        /* PImage.toImageData - Processing.js internally used */
        this.toImageData = function () {
            return frame.toImageData.apply(frame,arguments);
        };
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* extras */
        this.getCanvas = function () {
            return canvas;
        }

        /* + + + + + + + + + + + + + + + + + + + + + */
        /* PImage inheritance */
        /* http://processing.org/reference/PImage.html */
        /* PImage.width */
        this.__defineGetter__('width',function(){
            return frame.width;
        });
        /* PImage.height */
        this.__defineGetter__('height',function(){
            return frame.height;
        });
        /* PImage.pixels */
        this.__defineGetter__('pixels',function(){
            return frame.pixels;
        });
        /* PImage.isRemote - Processing.js internally used */
        this.__defineGetter__('isRemote',function(){
            return frame.isRemote;
        });
        this.__defineSetter__('isRemote',function(v){
            frame.isRemote = v;
        });
        /* + + + + + + + + + + + + + + + + + + + + + */
        /* PImage.sourceImg - Processing.js internally used */
        this.__defineGetter__('sourceImg',function(){
            return frame.sourceImg;
        });
        this.__defineSetter__('sourceImg',function(s){
            frame.sourceImg = s;
        });
    };
    return Movie;
})(window,document);
