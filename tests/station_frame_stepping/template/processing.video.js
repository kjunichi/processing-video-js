/**
 *  Attempting to write a Movie.class for Processing.js
 *
 *  https://github.com/fjenett/processing-video-js
 *
 *  
 *  fjenett - 2012
 */

var Movie = (function(window,document){
    
    var isChrome;

    var listeners = [];
    var sketch;
    var element, movie, frame;

    var posterImage;

    var shouldLoop = false;
    var playbackRate = 1;
    var volume;

    var isAvailable = false;
    var lastTime = -1, pollerTs = -1;
    var fpsToSeconds;

    var fps = 25.0;

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
    }

    var onCanplay = function (evt) {
        if ( !posterImage )
            movie.read();
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

    // http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(HTML5_Media)
    
    // https://developer.mozilla.org/en/DOM/HTMLVideoElement
    // https://developer.mozilla.org/en/DOM/HTMLMediaElement
    // https://developer-new.mozilla.org/en-US/docs/DOM/Media_events
    
    // https://developer.mozilla.org/En/Manipulating_video_using_canvas
    // http://www.html5videoguide.net/presentations/HTML5_Video_LCA2011/
        
    var Movie = function () {

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

        shouldLoop = ('loop' in element) ? element.loop : false;

        if ( ('poster' in element && element.poster) || opts.poster ) {
            posterImage = new Image();
            posterImage.onload = function () {
                if ( element.paused ) {
                    frame = new sketch.PImage();
                    frame.fromHTMLImageData( posterImage );
                }
            }
            posterImage.src = element.poster;
        }
        
        listeners = [];
        if ( opts.listener )
        {
            listeners.push(opts.listener);
            sketch = opts.listener;
            frame = new sketch.PImage();
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
    
    Movie.prototype = {
        /*  */
        setSourceFrameRate: function ( frameRate ) {
            fps = frameRate;
        },
        /*  */
        getElement: function () {
            return element;
        },
        /* sets the volume */
        volume: function ( vol ) {
            element.volume = vol;
            volume = vol;
        },
        /* Reads the current frame of the movie. */
        read: function () {
            frame = new sketch.PImage;
            try {
                frame.fromHTMLImageData(element);
                //frame.isRemote = false;
            } catch (e) {
                //console.log(e);
                throw(e);
            }
            return frame;
        },
        /* Returns "true" when a new movie frame is available to read. */
        available: function () {
            return isAvailable;
        },
        /* Play the movie */
        play: function () {
            element.play();
            startPolling();
        },
        isPlaying : function () {
            return !element.paused;
        },
        /* Pause the movie */
        pause: function () {
            element.pause();
            stopPolling();
        },
        isPaused : function () {
            return element.paused;
        },
        /* Stop the movie */
        stop: function () {
            element.pause();
            stopPolling();
        },
        /* Set loop attribute */
        loop : function () {
          shouldLoop = true;
          element.setAttribute('loop','loop');
        },
        /* Set loop attribute */
        noLoop: function () {
          shouldLoop = false;
          element.removeAttribute('loop');
        },
        isLooping : function () {
          return shouldLoop;
        },
        /* Jump to a specific second (from float) in the video */
        jump: function ( seconds ) {
            element.currentTime = seconds;
        },
        /* Return duration in seconds with frac (as float) */
        duration: function () {
            return element.duration;
        },
        /* Return video current time as seconds with frac (as float) */
        time: function () {
            return element.currentTime;
        },
        /* Set playback speed to be scaled by given value (as float) */
        speed: function ( rate ) {
            if ( rate !== 0.0 )
            {
                element.playbackRate = rate;
                playbackRate = rate;
            }
            else
            {
                element.pause();
            }
        },
        /* Set the frame rate of the movie in fps */
        frameRate: function ( rate ) {
            // can't as we can not get the fps from the movie ... ideas?
            //throw( 'Please use speed() instead' );
            this.speed( rate / fps );
        },
        /* GSVideo? */
        getSourceFrameRate: function () {
            //throw( 'This is not available for web video' );
            fps;
        },
        /* GSVideo? */
        goToBeginning: function () {
            this.jump(0);
        },
        /* Java? */
        dispose: function () {
            this.stop();
            document.body.removeChild(element);
            delete element;
        },
        /* ? */
        ready: function () {
            return element.readyState > 2;
        },
        /* ? */
        newFrame: function () {
            return this.available();
        },
        /* ? */
        getFilename: function () {
            return element.currentSrc;
        },
        /* PImage inheritance */
        /* http://processing.org/reference/PImage.html */
        /* PImage.get */
        get: function () {
            return frame.get.apply(frame,arguments);
        },
        /* PImage.set */
        set: function () {
            return frame.set.apply(frame,arguments);
        },
        /* PImage.copy */
        copy: function () {
            return frame.copy.apply(frame,arguments);
        },
        /* PImage.mask */
        mask: function () {
            return frame.mask.apply(frame,arguments);
        },
        /* PImage.blend */
        blend: function () {
            return frame.blend.apply(frame,arguments);
        },
        /* PImage.filter */
        filter: function () {
            return frame.filter.apply(frame,arguments);
        },
        /* PImage.save */
        save: function () {
            return frame.save.apply(frame,arguments);
        },
        /* PImage.resize */
        resize: function (){
            return frame.resize.apply(frame,arguments);
        },
        /* PImage.loadPixels */
        loadPixels: function () {
            return frame.loadPixels.apply(frame,arguments);
        },
        /* PImage.updatePixels */
        updatePixels: function () {
            return frame.updatePixels.apply(frame,arguments);
        },
        /* PImage.toImageData - Processing.js internally used */
        toImageData: function () {
            return frame.toImageData.apply(frame,arguments);
        }
    };

    /* PImage.width */
    Movie.prototype.__defineGetter__('width',function(){
        return frame.width;
    });
    /* PImage.height */
    Movie.prototype.__defineGetter__('height',function(){
        return frame.height;
    });
    /* PImage.pixels */
    Movie.prototype.__defineGetter__('pixels',function(){
        return frame.pixels;
    });
    /* PImage.isRemote - Processing.js internally used */
    Movie.prototype.__defineGetter__('isRemote',function(){
        return frame.isRemote;
    });
    Movie.prototype.__defineSetter__('isRemote',function(v){
        frame.isRemote = v;
    });
    /* PImage.sourceImg - Processing.js internally used */
    Movie.prototype.__defineGetter__('sourceImg',function(){
        return frame.sourceImg;
    });
    Movie.prototype.__defineSetter__('sourceImg',function(s){
        frame.sourceImg = s;
    });
    
    return Movie;
    
})(window,document);
