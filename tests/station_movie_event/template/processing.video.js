var Movie = function() {
  var f = [], h, b, k, a, g = !1, i = !1, l = -1, j = -1, n = function() {
    for(var c = "abort,canplay,canplaythrough,durationchange,emptied,ended,error,loadeddata,loadedmetadata,loadstart,mozaudioavailable,pause,play,playing,progress,ratechange,seeked,seeking,suspend,timeupdate,volumechange,waiting".split(","), a = 0;a < c.length;a++) {
      var f = "on" + c[a][0].toUpperCase() + c[a].substring(1);
      try {
        var e = eval(f);
        b.addEventListener(c[a], e)
      }catch(g) {
      }
    }
  }, o = function() {
    var a = function() {
      if(3 > b.readyState) {
        i = !1
      }else {
        var d = b.currentTime;
        if(i = l !== d) {
          for(var g = [k], e = 0, h = f.length;e < h;e++) {
            "movieEvent" in f[e] && f[e].movieEvent.apply(f[e], g)
          }
        }
        l = d
      }
      j = setTimeout(a, 40)
    };
    a()
  }, m = function() {
    var c = {};
    if(1 == arguments.length && "object" == typeof arguments[0]) {
      c = arguments[0]
    }else {
      if(2 <= arguments.length) {
        var c = Array.prototype.slice.call(arguments), d = c.shift(), c = {src:c, listener:d}
      }else {
        throw"Wrong number of args passed to Movie()!";
      }
    }
    b = c.element;
    if(!c.element && c.src) {
      b = document.createElement("video");
      b.setAttribute("crossorigin", "anonymous");
      for(var d = 0, i = c.src.length;d < i;d++) {
        var e = document.createElement("source");
        e.setAttribute("src", c.src[d]);
        b.appendChild(e)
      }
      d = document.createElement("div");
      d.style.position = "absolute";
      d.style.left = "-10000px";
      d.style.top = "-10000px";
      d.appendChild(b);
      document.body.appendChild(d)
    }
    g = "loop" in b;
    f = [];
    c.listener && (f.push(c.listener), h = c.listener, a = new h.PImage);
    n();
    navigator.appVersion.toLowerCase().indexOf("chrome");
    k = this
  };
  m.prototype = {volume:function(a) {
    return b.volume(a)
  }, read:function() {
    a = new h.PImage;
    a.fromHTMLImageData(b);
    return a
  }, available:function() {
    return i
  }, play:function() {
    b.play();
    o()
  }, isPlaying:function() {
    return!b.paused
  }, pause:function() {
    b.pause();
    clearTimeout(j)
  }, isPaused:function() {
    return b.paused
  }, stop:function() {
    b.stop();
    clearTimeout(j)
  }, loop:function() {
    g = !0;
    b.setAttribute("loop", "loop")
  }, noLoop:function() {
    g = !1;
    b.removeAttribute("loop")
  }, isLooping:function() {
    return g
  }, jump:function(a) {
    b.currentTime = a
  }, duration:function() {
    return b.duration
  }, time:function() {
    return b.currentTime
  }, speed:function(a) {
    0 !== a ? b.playbackRate = a : b.pause()
  }, frameRate:function() {
    throw"Please use speed() instead";
  }, ready:function() {
    return 2 < b.readyState
  }, dispose:function() {
    this.stop();
    document.body.removeChild(b);
    delete b
  }, newFrame:function() {
    return this.available()
  }, getFilename:function() {
    return b.currentSrc
  }, get:function() {
    return a.get.apply(a, arguments)
  }, set:function() {
    return a.set.apply(a, arguments)
  }, copy:function() {
    return a.copy.apply(a, arguments)
  }, mask:function() {
    return a.mask.apply(a, arguments)
  }, blend:function() {
    return a.blend.apply(a, arguments)
  }, filter:function() {
    return a.filter.apply(a, arguments)
  }, save:function() {
    return a.save.apply(a, arguments)
  }, resize:function() {
    return a.resize.apply(a, arguments)
  }, loadPixels:function() {
    return a.loadPixels.apply(a, arguments)
  }, updatePixels:function() {
    return a.updatePixels.apply(a, arguments)
  }};
  return m
}();
